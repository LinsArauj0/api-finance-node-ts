import { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../utils/sendJson';
import { readJsonBody } from '../utils/readJsonBody';
import { errorHandler } from '../middlewares/errorHandler';
import * as TransactionController from './TransactionController';

export async function handleGetAllTransactions(req: IncomingMessage, res: ServerResponse) {
    try {
        const transactions = await TransactionController.getAllTransactions();
        sendJson(res, 200, transactions);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleGetTransactionById(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const transaction = await TransactionController.getTransactionById(id);
        sendJson(res, 200, transaction);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleGetTransactionsByType(req: IncomingMessage, res: ServerResponse, type: 'income' | 'expense') {
    try {
        const transactions = await TransactionController.getTransactionsByType(type);
        sendJson(res, 200, transactions);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleGetTransactionsByPeriod(req: IncomingMessage, res: ServerResponse, startDate: string, endDate: string) {
    try {
        const transactions = await TransactionController.getTransactionsByPeriod(startDate, endDate);
        sendJson(res, 200, transactions);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleCreateTransaction(req: IncomingMessage, res: ServerResponse) {
    try {
        const data = await readJsonBody(req);
        const transaction = await TransactionController.createTransaction(data);
        sendJson(res, 201, transaction);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleUpdateTransaction(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const data = await readJsonBody(req);
        const transaction = await TransactionController.updateTransaction(id, data);
        sendJson(res, 200, transaction);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleDeleteTransaction(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const result = await TransactionController.deleteTransaction(id);
        sendJson(res, 200, result);
    } catch (error) {
        errorHandler(error, req, res);
    }
}