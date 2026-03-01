import { IncomingMessage, ServerResponse } from "http";
import { 
    handleGetAllTransactions,
    handleGetTransactionById,
    handleGetTransactionsByType,
    handleGetTransactionsByPeriod,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction
} from "../controllers/TransactionHandler";
import { sendJson } from "../utils/sendJson";

export async function transactionRoutes(req: IncomingMessage, res: ServerResponse) {
    const method = req.method;
    const url = req.url || '';
    
    if (method === "GET" && url === '/transactions') {
        return handleGetAllTransactions(req, res);
    }

    if (method === "GET" && url.startsWith('/transactions/type/')) {
        const type = url.split('/')[3] as 'income' | 'expense';
        return handleGetTransactionsByType(req, res, type);
    }
    
    if (method === "GET" && url.startsWith('/transactions/period')) {
        const urlObj = new URL(url, 'http://localhost');
        const startDate = urlObj.searchParams.get('start') || '';
        const endDate = urlObj.searchParams.get('end') || '';
        return handleGetTransactionsByPeriod(req, res, startDate, endDate);
    }
    
    if (method === 'GET' && url.startsWith('/transactions/')){
        const id = Number(url.split('/')[2]);
        return handleGetTransactionById(req, res, id);
    }
    
    if (method === 'POST' && url === '/transactions') {
        return handleCreateTransaction(req, res);
    }
    
    if (method === 'PUT' && url.startsWith('/transactions/')) {
        const id = Number(url.split('/')[2]);
        return handleUpdateTransaction(req, res, id);
    }
    
    if (method === 'DELETE' && url.startsWith('/transactions/')) {
        const id = Number(url.split('/')[2]);
        return handleDeleteTransaction(req, res, id);
    }
    
    sendJson(res, 404, { error: 'Route not found' });
}