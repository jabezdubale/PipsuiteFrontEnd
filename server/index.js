
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- File-Based Persistence (JSON Database) ---
const DB_FILE = path.join(__dirname, 'database.json');

const DEFAULT_DATA = {
    accounts: [{
        id: 'default_1',
        name: 'Main Account',
        currency: 'USD',
        balance: 10000,
        isDemo: true
    }],
    trades: [
        {
            id: '1',
            accountId: 'default_1',
            symbol: 'XAUUSD',
            type: 'LONG',
            entryDate: new Date().toISOString(),
            entryPrice: 1980.50,
            exitPrice: 1985.00,
            quantity: 1,
            fees: 5,
            setup: 'Gold Scalp',
            notes: 'Clean bounce off support',
            pnl: 445,
            status: 'WIN',
            screenshots: [],
            tags: ['scalp', 'london-session'],
            rMultiple: 2.1
        },
        {
            id: '2',
            accountId: 'default_1',
            symbol: 'EURUSD',
            type: 'SHORT',
            entryDate: new Date(Date.now() - 86400000 * 2).toISOString(), 
            entryPrice: 1.0550,
            exitPrice: 1.0580,
            quantity: 100000,
            fees: 7,
            setup: 'Trend Continuation',
            notes: 'News spiked against me',
            pnl: -307,
            status: 'LOSS',
            screenshots: [],
            tags: ['news'],
            rMultiple: -1.0
        }
    ]
};

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2));
    console.log('[Database] Created new database.json');
}

// Helper to read/write DB
const getDb = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('[Database] Read Error:', err);
        return DEFAULT_DATA;
    }
};

const saveDb = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('[Database] Write Error:', err);
    }
};

// Logging middleware
app.use((req, res, next) => {
    console.log(`[Backend] ${req.method} ${req.url}`);
    next();
});

// --- Routes (Prefixed with /api) ---

// ACCOUNTS
app.get('/api/accounts', (req, res) => {
    const db = getDb();
    res.json(db.accounts);
});

app.post('/api/accounts', (req, res) => {
    const db = getDb();
    const newAccount = req.body;
    const index = db.accounts.findIndex(a => a.id === newAccount.id);
    if (index >= 0) {
        db.accounts[index] = newAccount;
    } else {
        db.accounts.push(newAccount);
    }
    saveDb(db);
    res.json(db.accounts);
});

// TRADES
app.get('/api/trades', (req, res) => {
    const db = getDb();
    res.json(db.trades);
});

app.post('/api/trades', (req, res) => {
    const db = getDb();
    const newTrade = req.body;
    const index = db.trades.findIndex(t => t.id === newTrade.id);
    if (index >= 0) {
        db.trades[index] = newTrade;
    } else {
        db.trades.unshift(newTrade);
    }
    saveDb(db);
    res.json(db.trades);
});

app.delete('/api/trades/:id', (req, res) => {
    const db = getDb();
    const { id } = req.params;
    db.trades = db.trades.filter(t => t.id !== id);
    saveDb(db);
    res.json(db.trades);
});

// Root check
app.get('/', (req, res) => {
    res.send('PipSuite Backend is Running');
});

// Catch 404s
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.url}` });
});

// Bind to 0.0.0.0 to ensure accessibility
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Server running on port ${PORT}`);
});
