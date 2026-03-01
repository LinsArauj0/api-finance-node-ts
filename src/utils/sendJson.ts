import { ServerResponse } from "node:http";

export function sendJson(res: ServerResponse, statusCode: number, payload: any) {
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8"});
    
    if (statusCode >= 200 && statusCode < 300) {
        res.end(JSON.stringify({ data: payload }));
    }
    else {
        const errorMessage = payload.error || payload.message || payload;
        res.end(JSON.stringify({
            error: errorMessage
        }));
    }
}