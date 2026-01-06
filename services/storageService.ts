
import { Trade, Account, TradeType, TradeStatus, TagGroup, MonthlyNoteData } from '../types';

const STORAGE_KEYS = {
  TRADES: 'pipsuite_trades',
  ACCOUNTS: 'pipsuite_accounts',
  TAGS: 'pipsuite_tags',
  STRATEGIES: 'pipsuite_strategies',
  MONTHLY_NOTES: 'pipsuite_monthly_notes'
};

const DEFAULT_ACCOUNTS: Account[] = [{
    id: 'default_1',
    name: 'Main Account',
    currency: 'USD',
    balance: 10000,
    isDemo: true
}];

const DEFAULT_TRADES: Trade[] = [
    {
        id: '1',
        accountId: 'default_1',
        symbol: 'XAUUSD',
        type: TradeType.LONG,
        entryDate: new Date().toISOString(),
        entryPrice: 1980.50,
        exitPrice: 1985.00,
        quantity: 1,
        fees: 5,
        setup: 'Scalping',
        notes: 'Clean bounce off support',
        pnl: 445,
        status: TradeStatus.WIN,
        screenshots: [],
        tags: ['scalp', 'london-session', '#TP'],
        rMultiple: 2.1
    },
    {
        id: '2',
        accountId: 'default_1',
        symbol: 'EURUSD',
        type: TradeType.SHORT,
        entryDate: new Date(Date.now() - 86400000 * 2).toISOString(), 
        entryPrice: 1.0550,
        exitPrice: 1.0580,
        quantity: 100000,
        fees: 7,
        setup: 'Trend-Following',
        notes: 'News spiked against me',
        pnl: -307,
        status: TradeStatus.LOSS,
        screenshots: [],
        tags: ['news', '#SL'],
        rMultiple: -1.0
    }
];

const DEFAULT_TAG_GROUPS: TagGroup[] = [
  {
    name: 'Technical',
    tags: ['#BOS', '#CHoCH', '#OB', '#FVG', '#Liquidity-Sweep', '#POI-Entry', '#Inducement', '#Premium', '#Discount', '#Stop-Hunt', '#Mitigation', '#Eq-Highs', '#Eq-Lows']
  },
  {
    name: 'Execution',
    tags: ['#Break-Even', '#Partial', '#Early-Exit', '#Late-Chased', '#News-Vol', '#Manual-Close', '#Trailing', '#TP', '#SL']
  },
  {
    name: 'Emotional',
    tags: ['#FOMO', '#Revenge', '#Greed', '#Hesitation', '#Hope', '#Boredom', '#Over-Confidence', '#Impulsive', '#Disciplined', '#Anxious', '#Distracted']
  },
  {
    name: 'Risk Management',
    tags: ['#Fixed-Risk', '#Wrong-Risk', '#BE-Aggressive', '#BE-Passive', '#Over-Leveraged', '#Multiple-Risk', '#Max-Drawdown', '#Daily-Drawdown', '#Recovery-Risk']
  }
];

const DEFAULT_STRATEGIES: string[] = [
    'SMC',
    'Price-Action',
    'Supply-Demand',
    'Trend-Following',
    'Break-Retest',
    'News-Trading',
    'Range-Trading',
    'Scalping',
    'Order-Flow',
    'Gap-Fill'
];

// Helper to simulate async for API compatibility (makes transitions easier)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Account Management ---

export const getAccounts = async (): Promise<Account[]> => {
    await delay(50); // Small artificial delay
    const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
    }
    return JSON.parse(stored);
};

export const saveAccount = async (account: Account): Promise<Account[]> => {
    const accounts = await getAccounts();
    const index = accounts.findIndex(a => a.id === account.id);
    if (index >= 0) {
        accounts[index] = account;
    } else {
        accounts.push(account);
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    return accounts;
};

// --- Trade Management ---

export const getTrades = async (): Promise<Trade[]> => {
    await delay(50);
    const stored = localStorage.getItem(STORAGE_KEYS.TRADES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(DEFAULT_TRADES));
        return DEFAULT_TRADES;
    }
    return JSON.parse(stored);
};

export const saveTrade = async (trade: Trade): Promise<Trade[]> => {
    const trades = await getTrades();
    const index = trades.findIndex(t => t.id === trade.id);
    if (index >= 0) {
        trades[index] = trade;
    } else {
        trades.unshift(trade);
    }
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    return trades;
};

export const saveTrades = async (newTrades: Trade[]): Promise<Trade[]> => {
    const currentTrades = await getTrades();
    // Prepend new trades
    const updatedTrades = [...newTrades, ...currentTrades];
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(updatedTrades));
    return updatedTrades;
};

export const deleteTrade = async (id: string): Promise<Trade[]> => {
    const trades = await getTrades();
    const filtered = trades.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(filtered));
    return filtered;
};

export const deleteTrades = async (ids: string[]): Promise<Trade[]> => {
    const trades = await getTrades();
    const filtered = trades.filter(t => !ids.includes(t.id));
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(filtered));
    return filtered;
};

// --- Tag Management ---

export const getTagGroups = async (): Promise<TagGroup[]> => {
    await delay(50);
    const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(DEFAULT_TAG_GROUPS));
        return DEFAULT_TAG_GROUPS;
    }
    return JSON.parse(stored);
};

export const saveTagGroups = async (groups: TagGroup[]): Promise<TagGroup[]> => {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(groups));
    return groups;
};

// --- Strategy Management ---

export const getStrategies = async (): Promise<string[]> => {
    await delay(50);
    const stored = localStorage.getItem(STORAGE_KEYS.STRATEGIES);
    if (!stored) {
        localStorage.setItem(STORAGE_KEYS.STRATEGIES, JSON.stringify(DEFAULT_STRATEGIES));
        return DEFAULT_STRATEGIES;
    }
    return JSON.parse(stored);
};

export const saveStrategies = async (strategies: string[]): Promise<string[]> => {
    localStorage.setItem(STORAGE_KEYS.STRATEGIES, JSON.stringify(strategies));
    return strategies;
};

// --- Monthly Notes ---

export const getMonthlyNote = async (monthKey: string): Promise<MonthlyNoteData> => {
    await delay(50);
    const stored = localStorage.getItem(STORAGE_KEYS.MONTHLY_NOTES);
    const notes = stored ? JSON.parse(stored) : {};
    const entry = notes[monthKey];
    
    // Backward compatibility for when it was just a string
    if (typeof entry === 'string') {
        return { goals: '', notes: entry, review: '' };
    }
    
    return {
        goals: entry?.goals || '',
        notes: entry?.notes || '',
        review: entry?.review || ''
    };
};

export const saveMonthlyNote = async (monthKey: string, data: MonthlyNoteData): Promise<void> => {
    const stored = localStorage.getItem(STORAGE_KEYS.MONTHLY_NOTES);
    const notes = stored ? JSON.parse(stored) : {};
    notes[monthKey] = data;
    localStorage.setItem(STORAGE_KEYS.MONTHLY_NOTES, JSON.stringify(notes));
};
