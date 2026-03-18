const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LUA_EXAMPLES_PATH = path.resolve(__dirname, '../examples');

app.use(cors());
app.use(express.json());
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API to list all lua files in examples
app.get('/api/files', (req, res) => {
    console.log('Listing files in:', LUA_EXAMPLES_PATH);
    try {
        const files = glob.sync('**/*.lua', { cwd: LUA_EXAMPLES_PATH, nodir: true });
        console.log(`Found ${files.length} files`);
        const normalizedFiles = files.map(f => f.replace(/\\/g, '/'));
        res.json(normalizedFiles);
    } catch (err) {
        console.error('Glob error:', err);
        res.status(500).json({ error: 'Failed to list files' });
    }
});

// API to get content of a specific lua file
app.get('/api/file-content', (req, res) => {
    const relativePath = req.query.path;
    if (!relativePath) return res.status(400).json({ error: 'Path required' });
    
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
