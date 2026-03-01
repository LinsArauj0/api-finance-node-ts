import { IncomingMessage, ServerResponse } from "node:http";
import { 
    handleGetAllCategories, 
    handleGetCategoryById,
    handleGetCategoriesByType,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory
} from "../controllers/CategoryHandler";
import { sendJson } from "../utils/sendJson";

export async function categoriesRoutes(req: IncomingMessage, res: ServerResponse) {
    const method = req.method;
    const url = req.url || '';

    if (method === 'GET' && url === '/categories') {
        return handleGetAllCategories(req, res);
    }

    if (method === 'GET' && url.startsWith('/categories/type/')) {
        const type = url.split('/')[3] as 'income' | 'expense';
        return handleGetCategoriesByType(req, res, type);
    }

    if (method === 'GET' && url.startsWith('/categories/')) {
        const id = Number(url.split('/')[2]);
        return handleGetCategoryById(req, res, id);
    }

    if (method === 'POST' && url === '/categories') {
        return handleCreateCategory(req, res);
    }

    if (method === 'PUT' && url.startsWith('/categories/')) {
        const id = Number(url.split('/')[2]);
        return handleUpdateCategory(req, res, id);
    }

    if (method === 'DELETE' && url.startsWith('/categories/')) {
        const id = Number(url.split('/')[2]);
        return handleDeleteCategory(req, res, id);
    }

    sendJson(res, 404, { error: 'Route not found' });
}