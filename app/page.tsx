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
      setHistory(prev => [newEntry, ...prev].slice(0, 5)); // 最新5件
      setInputValue("");
    }
  };

  const handleReset = () => {
    if (spent < dailyBudget) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000); // 3秒でエフェクト終了
    }
    setSpent(0);
    setHistory([]);
  };

  const remaining = dailyBudget - spent;
  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-32">
      
      {/* 上部広告枠 */}
      <div className="w-full max-w-md mb-4 h-16 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-xs">
        AD SPACE (TOP BANNER)
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* 達成感エフェクトのオーバーレイ */}
        {isSuccess && (
          <div className="absolute inset-0 z-50 bg-blue-600/90 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
            <span className="text-6xl mb-4 animate-bounce">🎉</span>
            <h2 className="text-3xl font-black">NICE SAVING!</h2>
            <p className="text-lg opacity-90 mt-2">{rewardName}に転送確定！</p>
          </div>
        )}

        {/* Header */}
        <div className={`p-8 text-center transition-all ${remaining < 0 ? 'bg-red-500' : 'bg-blue-600'} text-white relative`}>
          <button onClick={() => setShowSettings(!showSettings)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition">⚙️</button>
          <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Remaining Today</p>
          <h1 className="text-5xl font-mono font-bold">¥{remaining.toLocaleString()}</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Settings (修正済み) */}
          {showSettings && (
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500">1日の予算 (円)</label>
                <input type="number" value={dailyBudget === 0 ? "" : dailyBudget} onChange={(e) => setDailyBudget(e.target.value === "" ? 0 : Number(e.target.value))} className="w-full border-b-2 border-gray-300 bg-transparent p-1 outline-none focus:border-blue-500" placeholder="0"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">貯金の名前</label>
                <input type="text" value={rewardName} onChange={(e) => setRewardName(e.target.value)} className="w-full border-b-2 border-gray-300 bg-transparent p-1 outline-none focus:border-blue-600"/>
              </div>
              <button onClick={() => setShowSettings(false)} className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm">設定を閉じる</button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2">
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="金額を入力" className="flex-1 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-lg"/>
            <button onClick={handleAddExpense} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all">Add</button>
          </div>

          {/* Reward Display */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex justify-between items-center">
            <div>
              <p className="text-blue-600 text-xs font-bold uppercase">Transfer to {rewardName}</p>
              <p className="text-2xl font-black text-blue-600">+{Math.max(0, remaining).toLocaleString()}</p>
            </div>
            <button onClick={handleReset} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-200">1日終了</button>
          </div>

          {/* History Section (新規追加) */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Today's History</h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-300 italic text-center py-4">履歴はありません</p>
            ) : (
              <ul className="space-y-2">
                {history.map(item => (
                  <li key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl text-sm border border-gray-100">
                    <span className="text-gray-400 font-mono">{item.time}</span>
                    <span className="font-bold text-gray-700">- ¥{item.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-red-300 text-xs underline">Clear All Data</button>
      </div>

      {/* 下部固定広告枠 */}
      <div className="fixed bottom-0 left-0 w-full h-20 bg-white border-t border-gray-200 flex items-center justify-center shadow-inner">
        <div className="w-full max-w-md h-12 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-gray-400 text-[10px]">
          AD BANNER (STICKY)
        </div>
      </div>
    </div>
  );
}
