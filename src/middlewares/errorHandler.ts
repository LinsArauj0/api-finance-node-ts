import { IncomingMessage, ServerResponse } from "node:http";
import { HttpError } from "../utils/httpError";
import { sendJson } from "../utils/sendJson";

export function errorHandler(
    error: unknown,
    req: IncomingMessage,
    res: ServerResponse
) {
    if (error instanceof HttpError) {
        return sendJson(res, error.statusCode, { error: error.message });
    }

    console.error('❌ Unexpected error:', {
        method: req.method,
        url: req.url,
        error: error
    });
    
    return sendJson(res, 500, { error: 'Internal server error' });
}