import Header from "@/components/header";
import { dbManager, Product } from "@/lib/db";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";

type FormState = {
    id: string | null;
    title: string;
    price: string;
    description: string;
};

const EMPTY_FORM: FormState = { id: null, title: "", price: "", description: "" };

export default function ProductsScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const loadProducts = useCallback(async (includeDeleted: boolean) => {
        const rows = await dbManager.getProducts(includeDeleted);
        setProducts(rows);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await dbManager.init();
                await loadProducts(showDeleted);
            } catch (e) {
                console.error(e);
                Alert.alert("Error", "Failed to initialize the database");
            } finally {
                setLoading(false);
            }
        })();
        // init runs once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading) return;
        loadProducts(showDeleted).catch((e) => console.error(e));
    }, [showDeleted, loading, loadProducts]);

    const openAddModal = () => {
        setForm(EMPTY_FORM);
        setModalVisible(true);
    };

    const openEditModal = (product: Product) => {
        setForm({
            id: product.id,
            title: product.title,
            price: String(product.price),
            description: product.description ?? "",
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setForm(EMPTY_FORM);
    };

    const handleSave = async () => {
        const title = form.title.trim();
        const priceNumber = Number(form.price.replace(",", "."));

        if (!title) {
            Alert.alert("Check the details", "Enter a product name");
            return;
        }
        if (!form.price || Number.isNaN(priceNumber) || priceNumber < 0) {
            Alert.alert("Check the details", "Enter a valid price");
            return;
        }

        setSaving(true);
        try {
            if (form.id) {
                await dbManager.updateProduct({
                    id: form.id,
                    title,
                    price: priceNumber,
                    description: form.description.trim() || undefined,
                });
            } else {
                await dbManager.addProduct({
                    id: "",
                    title,
                    price: priceNumber,
                    description: form.description.trim() || undefined,
                });
            }
            closeModal();
            await loadProducts(showDeleted);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to save the product");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (product: Product) => {
        Alert.alert(
            "Delete product?",
            `"${product.title}" will be hidden from the list.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await dbManager.deleteProduct(product);
                            await loadProducts(showDeleted);
                        } catch (e) {
                            console.error(e);
                            Alert.alert("Error", "Failed to delete the product");
                        }
                    },
                },
            ]
        );
    };

    const handleRestore = async (product: Product) => {
        try {
            await dbManager.restoreProduct(product);
            await loadProducts(showDeleted);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Failed to restore the product");
        }
    };

    const renderItem = ({ item }: { item: Product }) => {
        const isDeleted = !!item.deleted_at;

        return (
            <View style={[styles.card, isDeleted && styles.cardDeleted]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
                </View>

                {!!item.description && (
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                )}

                <View style={styles.cardFooter}>
                    {isDeleted ? (
                        <Pressable onPress={() => handleRestore(item)}>
                            <Text style={styles.linkBtnText}>Restore</Text>
                        </Pressable>
                    ) : (
                        <>
                            <Pressable onPress={() => openEditModal(item)}>
                                <Text style={styles.linkBtnText}>Edit</Text>
                            </Pressable>
                            <Pressable onPress={() => handleDelete(item)}>
                                <Text style={styles.linkBtnDanger}>Delete</Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.screen}>
            <Header text="Database" />

            <View style={styles.topBar}>
                <Text style={styles.title}>Products</Text>
                <Pressable style={styles.addBtn} onPress={openAddModal}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                </Pressable>
            </View>

            <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Show deleted</Text>
                <Switch value={showDeleted} onValueChange={setShowDeleted} />
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No products yet</Text> : null
                }
            />

            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            {form.id ? "Edit product" : "New product"}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={form.title}
                            onChangeText={(text) => setForm((f) => ({ ...f, title: text }))}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="0.00 $"
                            keyboardType="decimal-pad"
                            value={form.price}
                            onChangeText={(text) => setForm((f) => ({ ...f, price: text }))}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description (optional)"
                            multiline
                            numberOfLines={3}
                            value={form.description}
                            onChangeText={(text) => setForm((f) => ({ ...f, description: text }))}
                        />

                        <View style={styles.modalActions}>
                            <Pressable style={styles.modalBtnGhost} onPress={closeModal}>
                                <Text style={styles.modalBtnGhostText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.modalBtnPrimary} onPress={handleSave} disabled={saving}>
                                <Text style={styles.modalBtnPrimaryText}>
                                    {saving ? "Saving…" : "Save"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F5F3FF" },

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    title: { fontSize: 24, fontWeight: "700", color: "#7C3AED" },

    addBtn: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    addBtnText: { color: "#F5F3FF", fontWeight: "600", fontSize: 14 },

    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    toggleLabel: { fontSize: 14, color: "#7C3AED" },

    listContent: { paddingHorizontal: 16, paddingBottom: 24 },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    cardDeleted: { backgroundColor: "#EDE9FE" },

    cardHeader: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
    cardTitle: { fontSize: 15, fontWeight: "600", color: "#1F2A24", flexShrink: 1 },
    cardPrice: { fontSize: 15, fontWeight: "700", color: "#8B5CF6" },
    cardDescription: { fontSize: 13, color: "#8A8478", marginTop: 4 },

    cardFooter: { flexDirection: "row", gap: 16, marginTop: 10 },
    linkBtnText: { fontSize: 13, fontWeight: "600", color: "#7C3AED" },
    linkBtnDanger: { fontSize: 13, fontWeight: "600", color: "#B3452F" },

    emptyText: { textAlign: "center", marginTop: 40, color: "#8A8478" },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(31, 22, 56, 0.4)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 20,
        paddingBottom: 32,
    },
    modalTitle: { fontSize: 17, fontWeight: "700", color: "#7C3AED", marginBottom: 12 },

    input: {
        borderWidth: 1,
        borderColor: "#EDE9FE",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: "#1F2A24",
        backgroundColor: "#F5F3FF",
        marginBottom: 10,
    },
    textArea: { minHeight: 70, textAlignVertical: "top" },

    modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
    modalBtnGhost: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#F5F3FF",
    },
    modalBtnGhostText: { color: "#7C3AED", fontWeight: "600" },
    modalBtnPrimary: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#7C3AED",
    },
    modalBtnPrimaryText: { color: "#F5F3FF", fontWeight: "700" },
});