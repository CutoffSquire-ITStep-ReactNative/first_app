import * as Crypto from "expo-crypto";
import * as SQLite from "expo-sqlite";

export interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    created_at?: number;
    deleted_at?: number | null;
}


class DatabaseManager {
    private db: SQLite.SQLiteDatabase | null = null;

    async init() {
        this.db = await SQLite.openDatabaseAsync("shop.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS products(
                id CHAR(32) PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                created_at INTEGER DEFAULT(unixepoch()),
                deleted_at INTEGER DEFAULT NULL
            );
        `);
        console.log("DB created succesfully");
    }

    async addProduct(product: Product) {
        if (!this.db) throw new Error("DB is not initialized");

        const id = Crypto.randomUUID();

        await this.db.runAsync(
            'INSERT INTO products (id, title, price, description, created_at) VALUES(?, ?, ?, ?, ?);',
            [
                id,
                product.title,
                product.price,
                product.description ? product.description : null,
                Date.now()
            ]
        )

        return id;
    }

    async updateProduct(product: Product) {
        if (!this.db) throw new Error("DB is not initialized");

        await this.db.runAsync('UPDATE products SET title = ?, price = ?, description = ? WHERE id = ?', [
            product.title,
            product.price,
            product.description ? product.description : null,
            product.id
        ]);
    }

    async deleteProduct(product: Product) {
        if (!this.db) throw new Error("DB is not initialized");

        await this.db.runAsync('UPDATE products SET deleted_at = ? WHERE id = ?', [Date.now(), product.id]);
    }

    async restoreProduct(product: Product) {
        if (!this.db) throw new Error("DB is not initialized");

        await this.db.runAsync('UPDATE products SET deleted_at = NULL WHERE id = ?', [product.id]);
    }

    /**
     * @param includeDeleted якщо true — повертає також м'яко видалені товари
     */
    async getProducts(includeDeleted: boolean = false): Promise<Product[]> {
        if (!this.db) throw new Error("DB is not initialized");

        const query = includeDeleted
            ? 'SELECT * FROM products ORDER BY (deleted_at IS NOT NULL), title;'
            : 'SELECT * FROM products WHERE deleted_at IS NULL ORDER BY title;';

        const rows = await this.db.getAllAsync<Product>(query);

        return rows;
    }

}

export const dbManager = new DatabaseManager();