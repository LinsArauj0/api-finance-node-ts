import * as CategoryModel from "../models/CategoryModel";
import { HttpError } from "../utils/httpError";

export async function getAllCategories() {
    return CategoryModel.findAll();
}

export async function getCategoryById(id: number) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid category ID', 400);
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
        throw new HttpError('Category not found', 404);
    }

    return category;
}

export async function getCategoriesByType(type: 'income' | 'expense') {
    if (!['income', 'expense'].includes(type)) {
        throw new HttpError('Type must be income or expense', 400);
    }

    return CategoryModel.findByType(type);
}

export async function createCategory(data: CategoryModel.CreateCategoryData) {
    if (!data.name || data.name.trim() === '') {
        throw new HttpError('Name is required', 400);
    }

    if (data.name.trim().length < 3) {
        throw new HttpError('Name must have at least 3 characters', 400);
    }

    const existing = await CategoryModel.findByName(data.name);
    if (existing && existing.type === data.type) {
        throw new HttpError('Category with this name and type already exists', 409);
    }

    return CategoryModel.create(data);
}

export async function updateCategory(id: number, data: CategoryModel.CreateCategoryData) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid category ID', 400);
    }

    if (data.name !== undefined) {
        if (data.name.trim() === '' || data.name.trim().length < 3) {
            throw new HttpError('Name must have at least 3 characters', 400);
        }
    }

    if (data.type !== undefined) {
        if (!['income', 'expense'].includes(data.type)) {
            throw new HttpError('Type must be income or expense', 400);
        }
    }

    if (data.name) {
        const existing = await CategoryModel.findByName(data.name);
        if (existing && existing.type === data.type && existing.id !== id) {
            throw new HttpError('Category with this name and type already exists', 409);
        }
    }

    const category = await CategoryModel.update(id, data);
    if (!category) {
        throw new HttpError('Category not found', 404);
    }

    return category;
}

export async function deleteCategory(id: number) {
    if (!id || id <= 0) {
        throw new HttpError('Invalid Category ID', 400);
    }

    const deleted = await CategoryModel.remove(id);
    if (!deleted) {
        throw new HttpError('Category not found', 404);
    }

    return { message: 'Category deleted successfully' };
}