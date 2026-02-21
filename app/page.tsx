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

  useEffect(() => {
    setIsClient(true);
    const savedBudget = localStorage.getItem('dailyBudget');
    const savedReward = localStorage.getItem('rewardName');
    const savedSpent = localStorage.getItem('spent');
    const savedHistory = localStorage.getItem('history');
    if (savedBudget) setDailyBudget(Number(savedBudget));
    if (savedReward) setRewardName(savedReward);
    if (savedSpent) setSpent(Number(savedSpent));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('dailyBudget', dailyBudget.toString());
      localStorage.setItem('rewardName', rewardName);
      localStorage.setItem('spent', spent.toString());
      localStorage.setItem('history', JSON.stringify(history));
    }
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

  const remaining = dailyBudget - spent;
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 pb-32 font-sans">
      <div className="w-full max-w-md mb-4 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-[10px] text-center px-4">
        AD SPACE (TOP BANNER)
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl overflow-hidden relative border border-gray-100">
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-blue-600/95 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300 p-6 text-center">
            <span className="text-6xl mb-4 animate-bounce">🎉</span>
            <h2 className="text-2xl font-black">NICE SAVING!</h2>
            <p className="text-base opacity-90 mt-2">{rewardName}に転送確定！</p>
          </div>
        )}

        <div className={`p-8 text-center transition-all ${remaining < 0 ? 'bg-red-500' : 'bg-blue-600'} text-white relative`}>
          <button onClick={() => setShowSettings(!showSettings)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30">⚙️</button>
          <p className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">Remaining Today</p>
          <h1 className="text-4xl font-mono font-bold">¥{remaining.toLocaleString()}</h1>
        </div>

        <div className="p-6 space-y-6">
          {showSettings && (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 animate-in slide-in-from-top duration-200">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">1日の予算 (円)</label>
                <input type="number" value={dailyBudget === 0 ? "" : dailyBudget} onChange={(e) => setDailyBudget(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full border-b-2 border-gray-200 bg-transparent py-2 outline-none focus:border-blue-500 text-gray-900 font-bold text-lg" placeholder="1500"/>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase">貯金の名前</label>
                <input type="text" value={rewardName} onChange={(e) => setRewardName(e.target.value)} className="w-full border-b-2 border-gray-200 bg-transparent py-2 outline-none focus:border-blue-500 text-gray-900 font-bold text-lg" placeholder="ご褒美貯金"/>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-md">設定を閉じる</button>
            </div>
          )}

          {/* 入力欄の崩れを修正 */}
          <div className="flex w-full gap-2 items-stretch">
            <input 
              type="number" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              placeholder="金額" 
              className="min-w-0 flex-1 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-gray-900 font-bold text-lg bg-gray-50"
            />
            <button 
              onClick={handleAddExpense} 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black hover:bg-blue-700 active:scale-95 shadow-md shrink-0 text-sm"
            >
              Add
            </button>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center shadow-inner">
            <div className="min-w-0">
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-tighter">Transfer to {rewardName}</p>
              <p className="text-2xl font-black text-blue-900">+{Math.max(0, remaining).toLocaleString()}</p>
            </div>
            <button onClick={handleReset} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md active:translate-y-0.5 text-sm">1日終了</button>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Today's History</h3>
            {history.length === 0 ? (
              <p className="text-xs text-gray-300 italic text-center py-6 bg-gray-50 rounded-2xl">履歴はありません</p>
            ) : (
              <ul className="space-y-3">
                {history.map(item => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-mono text-[10px]">{item.time}</span>
                      <span className="font-bold text-gray-800 text-base">- ¥{item.amount.toLocaleString()}</span>
                    </div>
                    <button onClick={() => deleteHistoryItem(item.id, item.amount)} className="text-gray-300 hover:text-red-500 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md border-t border-gray-200 flex items-center justify-center z-40">
        <div className="w-full max-w-md h-12 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-400 text-[10px] font-bold px-4 text-center">AD BANNER (STICKY)</div>
      </div>
    </div>
  );
}
