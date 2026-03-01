// src/models/CategoryModel.ts

import { db } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// 1. Interface Category
export interface Category {
    id: number;
    name: string;
    type: 'income' | 'expense';
    created_at: Date;
}

// 2. Tipo para criar
export interface CreateCategoryData {
    name: string;
    type: 'income' | 'expense';
}

export async function findAll(): Promise<Category[]> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM categories');
    return rows as Category[];
}

export async function findById(id: number): Promise<Category | null> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] as Category || null;
}

export async function findByType(type: 'income' | 'expense'): Promise<Category[]> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM categories WHERE type = ?', [type]);
    return rows as Category[];
}

export async function findByName(name: string): Promise<Category | null> {
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM categories WHERE name = ?', [name]);
    return rows[0] as Category || null;
}

export async function create(data: CreateCategoryData): Promise<Category | null> {
    const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO categories (name, type) VALUES (?, ?)', [
        data.name,
        data.type]);
    
    return findById(result.insertId);
}

export async function update(id: number, data: CreateCategoryData): Promise<Category | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
    }

    if (data.type !== undefined) {
        fields.push('type = ?');
        values.push(data.type);
    }

    if (fields.length === 0) return findById(id);
    values.push(id);

    const [result] = await db.query<ResultSetHeader>(
        `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, 
        values
    );

    if (result.affectedRows === 0) return null;
    return findById(id);
}

export async function remove(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
        'DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
}