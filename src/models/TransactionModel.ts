import { db } from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interfaces
export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category_id: number;
  category_name?: string; // vem do JOIN
  date: string; // ou Date
  type: "income" | "expense";
  created_at: Date;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  category_id: number;
  date: string;
  type: "income" | "expense";
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  category_id?: number;
  date?: string;
  type?: "income" | "expense";
}

export async function findAll(): Promise<Transaction[]> {
  const SQL = `
        SELECT 
            transactions.*,
            categories.name as category_name
        FROM transactions
        LEFT JOIN categories ON transactions.category_id = categories.id
        ORDER BY transactions.date DESC
    `;
  const [rows] = await db.query<RowDataPacket[]>(SQL);
  return rows as Transaction[];
}

export async function findById(id: number): Promise<Transaction | null> {
  const SQL = `
        SELECT 
            transactions.*,
            categories.name as category_name
        FROM transactions
         LEFT JOIN categories ON transactions.category_id = categories.id
        WHERE transactions.id = ?
    `;
  const [rows] = await db.query<RowDataPacket[]>(SQL, [id]);
  return (rows[0] as Transaction) || null;
}

export async function findByType(
  type: "income" | "expense",
): Promise<Transaction[]> {
  const SQL = `
        SELECT 
            transactions.*,
            categories.name as category_name
        FROM transactions
        LEFT JOIN categories ON transactions.category_id = categories.id
        WHERE transactions.type = ?
        ORDER BY transactions.date DESC
        `;
  const [rows] = await db.query<RowDataPacket[]>(SQL, [type]);
  return rows as Transaction[];
}

export async function findByPeriod(
  startDate: string,
  endDate: string,
): Promise<Transaction[]> {
  const SQL = `
        SELECT 
            transactions.*,
            categories.name as category_name
        FROM transactions
        LEFT JOIN categories ON transactions.category_id = categories.id
        WHERE transactions.date BETWEEN ? AND ?
        ORDER BY transactions.date DESC
    `;

  const [rows] = await db.query<RowDataPacket[]>(SQL, [startDate, endDate]);
  return rows as Transaction[];
}

export async function create(
  data: CreateTransactionData,
): Promise<Transaction | null> {
  const SQL = `
        INSERT INTO 
        transactions (description, amount, category_id, date, type)
        VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.query<ResultSetHeader>(SQL, [
    data.description,
    data.amount,
    data.category_id,
    data.date,
    data.type,
  ]);
  return findById(result.insertId);
}

export async function update(
  id: number,
  data: UpdateTransactionData,
): Promise<Transaction | null> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.description !== undefined) {
    fields.push("description = ?");
    values.push(data.description);
  }

  if (data.amount !== undefined) {
    fields.push("amount = ?");
    values.push(data.amount);
  }

  if (data.category_id !== undefined) {
    fields.push("category_id = ?");
    values.push(data.category_id);
  }

  if (data.date !== undefined) {
    fields.push("date = ?");
    values.push(data.date);
  }

  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }

  if (fields.length === 0) return findById(id);
  values.push(id);

  const [result] = await db.query<ResultSetHeader>(
    `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  if (result.affectedRows === 0) return null;
  return findById(id);
}

export async function remove(id: number): Promise<boolean> {
  const [result] = await db.query<ResultSetHeader>(
    "DELETE FROM transactions WHERE id =?",
    [id],
  );
  return result.affectedRows > 0;
}
