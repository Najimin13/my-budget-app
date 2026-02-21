"use client";
import React, { useState, useEffect } from 'react';

interface HistoryItem {
  id: number;
  amount: number;
  time: string;
}

export default function ProfessionalBudgetApp() {
  const [isClient, setIsClient] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(1500);
  const [rewardName, setRewardName] = useState("ご褒美貯金");
  const [spent, setSpent] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 初回のみ実行
  useEffect(() => {
    const b = localStorage.getItem('dailyBudget');
    const r = localStorage.getItem('rewardName');
    const s = localStorage.getItem('spent');
    const h = localStorage.getItem('history');
    if (b) setDailyBudget(Number(b));
    if (r) setRewardName(r);
    if (s) setSpent(Number(s));
    if (h) setHistory(JSON.parse(h));
    setIsClient(true);
  }, []);

  // データ保存用
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('dailyBudget', dailyBudget.toString());
    localStorage.setItem('rewardName', rewardName);
    localStorage.setItem('spent', spent.toString());
    localStorage.setItem('history', JSON.stringify(history));
  }, [dailyBudget, rewardName, spent, history, isClient]);

  const handleAddExpense = () => {
    const amount = parseInt(inputValue);
    if (!isNaN(amount) && amount > 0) {
      setSpent(prev => prev + amount);
      const newEntry: HistoryItem = {
        id: Date.now(),
        amount: amount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setHistory(prev => [newEntry, ...prev]);
      setInputValue("");
    }
  };

  const deleteHistoryItem = (id: number, amount: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    setSpent(prev => prev - amount);
  };

  const handleReset = () => {
    if (spent < dailyBudget) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
    setSpent(0);
    setHistory([]);
  };

  if (!isClient) return <div className="min-h-screen bg-gray-100" />;

  const remaining = dailyBudget - spent;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-32 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-blue-600/95 flex flex-col items-center justify-center text-white p-6 text-center">
            <span className="text-6xl mb-4">🎉</span>
            <h2 className="text-3xl font-black italic">NICE SAVING!</h2>
            <p className="text-lg opacity-90 mt-2 font-bold">{rewardName}へ転送確定！</p>
          </div>
        )}

        <div className={`p-8 text-center ${remaining < 0 ? 'bg-red-500' : 'bg-blue-600'} text-white relative`}>
          <button onClick={() => setShowSettings(!showSettings)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full">⚙️</button>
          <p className="text-xs font-bold opacity-80 mb-1">Remaining Today</p>
          <h1 className="text-5xl font-mono font-bold">¥{remaining.toLocaleString()}</h1>
        </div>

        <div className="p-6 space-y-6">
          {showSettings && (
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 space-y-4">
              <input type="number" value={dailyBudget} onChange={(e) => setDailyBudget(Number(e.target.value))} className="w-full border-b-2 p-2 text-gray-900 font-bold" placeholder="予算"/>
              <input type="text" value={rewardName} onChange={(e) => setRewardName(e.target.value)} className="w-full border-b-2 p-2 text-gray-900 font-bold" placeholder="貯金名"/>
              <button onClick={() => setShowSettings(false)} className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold">閉じる</button>
            </div>
          )}

          {/* 入力エリア：文字色を濃い黒（text-gray-900）に固定 */}
          <div className="flex gap-2">
            <input 
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="金額を入力" 
              className="flex-1 border-2 rounded-2xl px-4 py-4 text-gray-900 font-bold text-xl bg-gray-50 outline-none focus:border-blue-500"
            />
            <button onClick={handleAddExpense} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black">Add</button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-[10px] font-black uppercase">Transfer to {rewardName}</p>
              <p className="text-2xl font-black text-blue-900">+{Math.max(0, remaining).toLocaleString()}</p>
            </div>
            <button onClick={handleReset} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg">1日終了</button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Today's History</h3>
            <ul className="space-y-3">
              {history.map(item => (
                <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border">
                  <span className="font-bold text-gray-800">- ¥{item.amount.toLocaleString()}</span>
                  <button onClick={() => deleteHistoryItem(item.id, item.amount)} className="text-gray-400 p-2 text-xl">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
