
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors() as any);
app.use(express.json() as any);

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root_password',
    database: process.env.DB_NAME || 'sdkcti'
};

const pool = mysql.createPool(dbConfig);
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- CONFIGURAÇÕES ---
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM system_settings');
        const settings = (rows as any[]).reduce((acc, curr) => {
            acc[curr.setting_key] = curr.setting_value;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) { res.status(500).json({ error: 'Erro settings' }); }
});

app.post('/api/settings', async (req, res) => {
    const settings = req.body;
    try {
        for (const [key, value] of Object.entries(settings)) {
            await pool.query('INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?', [key, value, value]);
        }
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: 'Erro save settings' }); }
});

// --- SITES AUTENTICADOS ---
app.get('/api/auth-sites', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM monitored_auth_sites');
    res.json(rows);
});

app.post('/api/auth-sites', async (req, res) => {
    const { name, url, username, password } = req.body;
    await pool.query('INSERT INTO monitored_auth_sites (name, url, username, password) VALUES (?, ?, ?, ?)', [name, url, username, password]);
    res.json({ success: true });
});

// --- ATIVOS (SCOPE) ---
app.get('/api/assets', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM assets ORDER BY created_at DESC');
    res.json(rows);
});

app.post('/api/assets', async (req, res) => {
    const { type, value } = req.body;
    const [result] = await pool.query('INSERT INTO assets (type, value, status) VALUES (?, ?, ?)', [type, value, 'Verifying']);
    res.json({ id: (result as any).insertId });
});

// --- THREAT INTELLIGENCE ---
app.get('/api/threat-actors', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM threat_actors');
    res.json(rows);
});

app.get('/api/iocs', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM iocs ORDER BY last_seen DESC');
    res.json(rows);
});

app.get('/api/ransomware-victims', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM ransomware_victims ORDER BY date_published DESC');
    res.json(rows);
});

// --- PLAYBOOKS ---
app.get('/api/playbooks', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM playbooks');
    res.json(rows);
});

app.get('/api/playbooks/:id/steps', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM playbook_steps WHERE playbook_id = ? ORDER BY step_order', [req.params.id]);
    res.json(rows);
});

// --- GOVERNANÇA ---
app.get('/api/audit/questions', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM supplier_questions');
    res.json(rows);
});

// --- IA CORRELATION ---
app.post('/api/correlate', async (req, res) => {
    try {
        const [assets] = await pool.query('SELECT value, type FROM assets') as any;
        const assetList = assets.map((a: any) => `${a.type}: ${a.value}`).join(', ');
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Realize correlação tática para os ativos: [${assetList}]. Identifique ameaças recentes na CISA KEV e blogs de Ransomware.`,
            config: { tools: [{ googleSearch: {} }] }
        });
        res.json({ text: response.text });
    } catch (error) { res.status(500).json({ error: 'IA Failure' }); }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend ThreatOne rodando na porta ${PORT}`));
