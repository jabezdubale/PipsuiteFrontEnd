
import React, { useState } from 'react';
import { Account } from '../types';
import { X, Save } from 'lucide-react';

interface AddAccountModalProps {
  onSave: (account: Account) => void;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    currency: 'USD',
    balance: 10000,
    isDemo: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newAccount: Account = {
      id: `acc_${Date.now()}`,
      name: formData.name,
      currency: formData.currency || 'USD',
      balance: Number(formData.balance),
      isDemo: formData.isDemo !== undefined ? formData.isDemo : true
    };

    onSave(newAccount);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-surface border border-border rounded-xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold">Add Trading Account</h3>
          <button onClick={onClose} className="text-textMuted hover:text-textMain"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-textMuted mb-1">Account Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-background border border-border rounded p-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none"
              placeholder="e.g. My Demo Account"
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-textMuted mb-1">Currency</label>
              <select 
                value={formData.currency} 
                onChange={e => setFormData({...formData, currency: e.target.value})}
                className="w-full bg-background border border-border rounded p-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
               <label className="block text-xs font-medium text-textMuted mb-1">Initial Balance</label>
               <input 
                 type="number" 
                 value={formData.balance} 
                 onChange={e => setFormData({...formData, balance: parseFloat(e.target.value)})}
                 className="w-full bg-background border border-border rounded p-2 text-sm text-textMain focus:ring-1 focus:ring-primary outline-none"
               />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-surfaceHighlight/50 rounded-lg">
            <input 
              type="checkbox" 
              id="isDemo"
              checked={formData.isDemo}
              onChange={e => setFormData({...formData, isDemo: e.target.checked})}
              className="rounded border-border bg-background text-primary focus:ring-primary"
            />
            <label htmlFor="isDemo" className="text-sm text-textMain cursor-pointer">This is a Demo Account</label>
          </div>

          <div className="pt-2">
             <button type="submit" className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm">
               <Save size={16} /> Create Account
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
