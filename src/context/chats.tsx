import { Notifications } from "@/lib/notifications";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { AppState, Platform } from "react-native";

export type Message = { id: string; text: string; fromMe: boolean };
export type Chat = { id: string; name: string; messages: Message[]; unread: number };
export type Notice = { chatId: string; name: string; text: string };

type Planned = { id: string; chatId: string; text: string; at: number };
type NotifData = { id: string; chatId: string; text: string };

const uid = () => `${Date.now()}-${Math.random()}`;
const QUEUE = 20;

const INITIAL: Chat[] = [
    { id: "1", name: "Анна", unread: 0, messages: [{ id: uid(), text: "Привіт!", fromMe: false }] },
    { id: "2", name: "Максим", unread: 0, messages: [{ id: uid(), text: "Ти вдома?", fromMe: false }] },
    { id: "3", name: "Робота", unread: 0, messages: [{ id: uid(), text: "Мітинг о 15:00", fromMe: false }] },
    { id: "4", name: "Мама", unread: 0, messages: [{ id: uid(), text: "Не забудь пообідати", fromMe: false }] },
];

const PHRASES = [
    "Ну що, як справи?",
    "Ти бачив новини?",
    "Передзвони, коли зможеш",
    "Скинь фото",
    "Сьогодні бачимось?",
    "Дякую!",
    "Це терміново",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

let openChatForHandler: string | null = null;

Notifications?.setNotificationHandler({
    handleNotification: async (n) => ({
        shouldShowBanner: (n.request.content.data as NotifData).chatId !== openChatForHandler,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

type Ctx = {
    chats: Chat[];
    notification: Notice | null;
    openChatId: string | null;
    openChat: (id: string) => void;
    closeChat: () => void;
    dismissNotification: () => void;
    sendMessage: (chatId: string, text: string) => void;
};

const ChatsContext = createContext<Ctx | null>(null);

export const useChats = () => {
    const ctx = useContext(ChatsContext);
    if (!ctx) throw new Error("useChats must be used inside ChatsProvider");
    return ctx;
};

export function ChatsProvider({ children }: { children: ReactNode }) {
    const [chats, setChats] = useState<Chat[]>(INITIAL);
    const [notification, setNotification] = useState<Notice | null>(null);
    const [openChatId, setOpenChatId] = useState<string | null>(null);

    const openRef = useRef<string | null>(null);
    openRef.current = openChatId;
    openChatForHandler = openChatId;

    const plan = useRef<Planned[]>([]);
    const applied = useRef<Set<string>>(new Set());
    const lastAt = useRef(Date.now());

    const addMessage = useCallback((chatId: string, text: string, fromMe: boolean) => {
        setChats((prev) =>
            prev.map((c) =>
                c.id !== chatId
                    ? c
                    : {
                          ...c,
                          messages: [...c.messages, { id: uid(), text, fromMe }],
                          unread:
                              fromMe || openRef.current === chatId ? c.unread : c.unread + 1,
                      }
            )
        );
    }, []);

    const receive = useCallback(
        (chatId: string, text: string, id: string) => {
            if (applied.current.has(id)) return;
            applied.current.add(id);
            addMessage(chatId, text, false);
        },
        [addMessage]
    );

    const flush = useCallback(() => {
        const now = Date.now();
        const due = plan.current.filter((p) => p.at <= now);
        due.forEach((p) => {
            receive(p.chatId, p.text, p.id);
            if (!Notifications && openRef.current === null) {
                const name = INITIAL.find((c) => c.id === p.chatId)?.name ?? "";
                setNotification({ chatId: p.chatId, name, text: p.text });
            }
        });
        plan.current = plan.current.filter((p) => p.at > now);
    }, [receive]);

    const topUp = useCallback(async () => {
        const now = Date.now();
        if (lastAt.current < now) lastAt.current = now;
        for (let i = plan.current.length; i < QUEUE; i++) {
            lastAt.current += 5000 + Math.random() * 10000;
            const chat = pick(INITIAL);
            const item: Planned = {
                id: uid(),
                chatId: chat.id,
                text: pick(PHRASES),
                at: lastAt.current,
            };
            plan.current.push(item);
            if (Notifications) {
                const data: NotifData = { id: item.id, chatId: item.chatId, text: item.text };
                await Notifications.scheduleNotificationAsync({
                    content: { title: chat.name, body: item.text, data },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                        seconds: Math.max(1, Math.round((item.at - Date.now()) / 1000)),
                        channelId: "messages",
                    },
                });
            }
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (Notifications) {
                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("messages", {
                        name: "Messages",
                        importance: Notifications.AndroidImportance.HIGH,
                    });
                }
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== "granted") return;
                await Notifications.cancelAllScheduledNotificationsAsync();
            }
            await topUp();
        })();
    }, [topUp]);

    useEffect(() => {
        const timer = setInterval(flush, 1000);
        const sub = AppState.addEventListener("change", (s) => {
            if (s === "active") {
                flush();
                topUp();
            }
        });
        return () => {
            clearInterval(timer);
            sub.remove();
        };
    }, [flush, topUp]);

    const response = Notifications ? Notifications.useLastNotificationResponse() : undefined;
    const handled = useRef<string | null>(null);
    useEffect(() => {
        if (!response) return;
        const key = response.notification.request.identifier;
        if (handled.current === key) return;
        handled.current = key;
        const d = response.notification.request.content.data as NotifData;
        if (!d?.chatId) return;
        receive(d.chatId, d.text, d.id);
        openChat(d.chatId);
    }, [response]);

    const openChat = (id: string) => {
        setOpenChatId(id);
        setNotification(null);
        setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    };

    return (
        <ChatsContext.Provider
            value={{
                chats,
                notification,
                openChatId,
                openChat,
                closeChat: () => setOpenChatId(null),
                dismissNotification: () => setNotification(null),
                sendMessage: (chatId, text) => addMessage(chatId, text, true),
            }}
        >
            {children}
        </ChatsContext.Provider>
    );
}