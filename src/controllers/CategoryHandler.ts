// src/controllers/CategoryHandler.ts

import { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from '../utils/sendJson';
import { readJsonBody } from '../utils/readJsonBody';
import { errorHandler } from '../middlewares/errorHandler';
import * as CategoryController from './CategoryController';

export async function handleGetAllCategories(req: IncomingMessage, res: ServerResponse) {
    try {
        const categories = await CategoryController.getAllCategories();
        sendJson(res, 200, categories);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleGetCategoryById(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const category = await CategoryController.getCategoryById(id);
        sendJson(res,200, category);
    } catch (error) {
        errorHandler(error, req, res);
    }
}
export async function handleGetCategoriesByType(req: IncomingMessage, res: ServerResponse, type: 'income' | 'expense') {
    try {
        const categories = await CategoryController.getCategoriesByType(type);
        sendJson(res, 200, categories);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleCreateCategory(req: IncomingMessage, res: ServerResponse) {
    try {
        const data = await readJsonBody(req);
        const category = await CategoryController.createCategory(data);
        sendJson(res, 201, category);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleUpdateCategory(req: IncomingMessage, res: ServerResponse, id: number) {
    try {
        const data = await readJsonBody(req);
        const category = await CategoryController.updateCategory(id, data);
        sendJson(res, 200, category);
    } catch (error) {
        errorHandler(error, req, res);
    }
}

export async function handleDeleteCategory(req: IncomingMessage, res: ServerResponse ,id: number) {
    try {
        const result = await CategoryController.deleteCategory(id);
        sendJson(res, 200, result)
    } catch (error) {
        errorHandler(error, req, res);
    }
}