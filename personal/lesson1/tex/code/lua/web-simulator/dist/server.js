import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDist = __dirname.endsWith('dist');
const rootDir = isDist ? path.resolve(__dirname, '..') : __dirname;
const app = express();
const PORT = process.env.PORT || 3000;
// Fix: Resolve to the correct absolute path for examples
// web-simulator is in personal\lesson1\tex\code\lua\web-simulator
// examples are in personal\lessons\code\lua\examples
const LUA_EXAMPLES_PATH = path.resolve(rootDir, '../../../../lessons/code/lua/examples');
app.use(cors());
app.use(express.json());
// Serve static files from public directory
// app.use(express.static(path.join(__dirname, 'public')));
// API to list all lua files in examples
app.get('/api/files', (req, res) => {
    console.log('Listing files in:', LUA_EXAMPLES_PATH);
    try {
        const files = glob.sync('**/*.lua', { cwd: LUA_EXAMPLES_PATH, nodir: true });
        console.log(`Found ${files.length} files`);
        const normalizedFiles = files.map((f) => f.replace(/\\/g, '/'));
        res.json(normalizedFiles);
    }
    catch (err) {
        console.error('Glob error:', err);
        res.status(500).json({ error: 'Failed to list files' });
    }
});
// API to get content of a specific lua file
app.get('/api/file-content', (req, res) => {
    const relativePath = req.query.path;
    if (!relativePath)
        return res.status(400).json({ error: 'Path required' });
    const filePath = path.join(LUA_EXAMPLES_PATH, relativePath);
    // Security check: ensure path is within examples directory
    if (!filePath.startsWith(LUA_EXAMPLES_PATH)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
});
// API for Swagger documentation (stub)
app.get('/api-docs', (req, res) => {
    res.json({ message: "OpenAPI documentation will be here" });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
