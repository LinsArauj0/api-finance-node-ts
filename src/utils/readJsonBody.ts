import { IncomingMessage } from "node:http";
import { HttpError } from "./httpError";

export function readJsonBody(req: IncomingMessage, maxSize = 1048576): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = '';
        let size = 0;

        req.on('data', (chunk) => {
            size += chunk.length;

            if (size > maxSize) {
                req.destroy();
                return reject(new HttpError('Request body too large', 413));
            }

            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                if (!body) return resolve({});
                resolve(JSON.parse(body));
            } catch {
                reject(new HttpError('Invalid JSON', 400));
            }
        });

        req.on('error', () => {
            reject(new HttpError('Error reading request body', 400));
        });
    });
}