import * as TransactionModel from "../models/TransactionModel";
import * as CategoryModel from "../models/CategoryModel";
import { HttpError } from "../utils/httpError";

export async function getAllTransactions() {
    return TransactionModel.findAll();
}

export async function getTransactionsByType(type: 'income' | 'expense') {
    return TransactionModel.findByType(type);
}

export async function getTransactionById(id: number) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid transaction ID', 400);
    }
    
    const transaction = await TransactionModel.findById(id);
    if (!transaction) {
        throw new HttpError('Transaction not found', 404);
    }
    
    return transaction;
}

export async function getTransactionsByPeriod(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
        throw new HttpError('Start date and end date are required', 400);
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate); 
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new HttpError('Invalid date format', 400);
    }
    
    if (start > end) {
        throw new HttpError('Start date must be before or equal to end date', 400);
    }
    
    return TransactionModel.findByPeriod(startDate, endDate);
}

export async function createTransaction(data: TransactionModel.CreateTransactionData) {
    if (!data.description || data.description.trim() === '') {
        throw new HttpError('Description is required', 400);
    }

    if (data.description.trim().length < 3) {
        throw new HttpError('Description must have at least 3 characters', 400);
    }

    if (!data.amount || data.amount <= 0) {
        throw new HttpError('Amount must be greater than zero', 400);
    }
    
    if (!data.date) {
        throw new HttpError('Date is required', 400);
    }
    
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
        throw new HttpError('Invalid date format', 400);
    }

    if (!['income', 'expense'].includes(data.type)) {
        throw new HttpError('Type must be income or expense', 400);
    }

    const category = await CategoryModel.findById(data.category_id);
    if (!category) {
        throw new HttpError('Category not found', 404);
    }

    if (data.type !== category.type) {
        throw new HttpError(
            `Transaction type "${data.type}" does not match category type "${category.type}"`, 
            400
        );
    }

    return TransactionModel.create(data);
}

export async function updateTransaction(
    id: number,
    data: TransactionModel.UpdateTransactionData
) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid transaction ID', 400);
    }

    if (data.description !== undefined) {
        if (data.description.trim() === '' || data.description.trim().length < 3) {
            throw new HttpError('Description must have at least 3 characters', 400);
        }
    }

    if (data.amount !== undefined) {
        if (data.amount <= 0) {
            throw new HttpError('Amount must be greater than zero', 400);
        }
    }

    if (data.date !== undefined) {
        const date = new Date(data.date);
        if (isNaN(date.getTime())) {
            throw new HttpError('Invalid date format', 400);
        }
    }

    if (data.type !== undefined) {
        if (!['income', 'expense'].includes(data.type)) {
            throw new HttpError('Type must be income or expense', 400);
        }
    }

    if (data.category_id !== undefined || data.type !== undefined) {
        const currentTransaction = await TransactionModel.findById(id);
        if (!currentTransaction) {
            throw new HttpError('Transaction not found', 404);
        }

        const categoryId = data.category_id ?? currentTransaction.category_id;
        const type = data.type ?? currentTransaction.type;

        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw new HttpError('Category not found', 404);
        }

        if (type !== category.type) {
            throw new HttpError(
                `Transaction type "${type}" does not match category type "${category.type}"`,
                400
            );
        }
    }

    const transaction = await TransactionModel.update(id, data);
    if (!transaction) {
        throw new HttpError('Transaction not found', 404);
    }
    
    return transaction;
}

export async function deleteTransaction(id: number) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid transaction ID', 400);
    }

    const success = await TransactionModel.remove(id);
    if (!success) {
        throw new HttpError('Transaction not found', 404);
    }

    return { message: 'Transaction deleted successfully' };
}