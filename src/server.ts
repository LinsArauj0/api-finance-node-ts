import 'dotenv/config';
import { createServer } from "http";
import { categoryRoutes } from './routes/categoryRoutes';
import { transactionRoutes } from './routes/transactionRoutes';

const PORT = Number(process.env.PORT) || 3000;

const server = createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Tratar OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
    
    const url = req.url || '';
    
    // Roteamento
    if (url.startsWith('/categories')) {
        return categoryRoutes(req, res);
    }
    
    if (url.startsWith('/transactions')) {
        return transactionRoutes(req, res);
    }
    
    // 404 para rotas desconhecidas
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`\n📂 Categories routes:`);
    console.log(`   GET    /categories`);
    console.log(`   GET    /categories/type/:type`);
    console.log(`   GET    /categories/:id`);
    console.log(`   POST   /categories`);
    console.log(`   PUT    /categories/:id`);
    console.log(`   DELETE /categories/:id`);
    console.log(`\n💰 Transactions routes:`);
    console.log(`   GET    /transactions`);
    console.log(`   GET    /transactions/:id`);
    console.log(`   GET    /transactions/type/:type`);
    console.log(`   GET    /transactions/period?start=YYYY-MM-DD&end=YYYY-MM-DD`);
    console.log(`   POST   /transactions`);
    console.log(`   PUT    /transactions/:id`);
    console.log(`   DELETE /transactions/:id`);
});