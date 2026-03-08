import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState({ userName: "0", coinBalance: 0, undoneCount: 0, todos: [], rewards: [] });
  const [newTask, setNewTask] = useState({ task: "", reward: 0 });
  const [newReward, setNewReward] = useState({ name: "", price: 0 });
  const [newUsername, setNewUsername] = useState("");

  // Fungsi sinkronisasi data dari C++
  const refreshData = () => {
    fetch('http://localhost:8080/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Koneksi Backend Terputus!", err));
  };

  useEffect(() => refreshData(), []);

  // --- SOLUSI CORS: Headers Dihapus Agar Browser Tidak "Cek Ombak" ---
  const postData = (endpoint, bodyData) => {
    fetch(`http://localhost:8080/api/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(bodyData) // Mengirim langsung tanpa label khusus
    }).then(res => {
      if(!res.ok) {
        if(res.status === 400) alert("Maaf, saldo koin kamu tidak cukup untuk memperoleh self reward tersebut.");
      } else {
        refreshData();
      }
    }).catch(err => console.error(err));
  };

  // --- Pemetaan Fitur Terminal ke Web ---
  const addTodo = () => {
    if (!newTask.task) return;
    postData('add-todo', newTask);
    setNewTask({ task: "", reward: 0 });
  };

  const addReward = () => {
    if (!newReward.name) return;
    postData('add-reward', newReward);
    setNewReward({ name: "", price: 0 });
  };

  const changeUsername = () => {
    if (!newUsername) return;
    postData('change-username', { username: newUsername });
    setNewUsername("");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- Header / Dashboard Utama --- */}
        <div className="bg-slate-800 p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-center border border-slate-700 shadow-2xl">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
              Task Adventure
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-lg text-slate-400">Player: <span className="text-white font-bold">{data.userName}</span></span>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Username baru..." 
                  className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-yellow-500"
                  value={newUsername} onChange={e => setNewUsername(e.target.value)}
                />
                <button onClick={changeUsername} className="bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded text-sm transition-all">Ganti</button>
              </div>
            </div>
          </div>
          <div className="text-right bg-slate-900 px-8 py-4 rounded-2xl border border-yellow-600/30">
            <p className="text-4xl font-black text-yellow-400 mb-1">💰 {data.coinBalance} Koin</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{data.undoneCount} Tugas Belum Selesai</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Kolom Kiri: TO-DO LIST --- */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-3">⚔️ Daftar Tugas</h2>
            
            <div className="flex gap-3 mb-8 bg-slate-900 p-3 rounded-xl border border-slate-700">
              <input 
                type="text" placeholder="Tugas baru..." 
                className="bg-transparent flex-grow px-2 outline-none"
                value={newTask.task} onChange={e => setNewTask({...newTask, task: e.target.value})}
              />
              <input 
                type="number" placeholder="Koin" 
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 w-24 outline-none"
                value={newTask.reward} onChange={e => setNewTask({...newTask, reward: parseInt(e.target.value) || 0})}
              />
              <button onClick={addTodo} className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-2 rounded-lg transition-all">Tambah</button>
            </div>

            <div className="space-y-3">
              {data.todos.map((todo, index) => (
                <div key={index} className={`p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${todo.done ? 'bg-slate-800/50 border border-slate-700 opacity-60' : 'bg-slate-900 border-l-4 border-yellow-500 shadow-lg'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{todo.done ? '✅' : '🛡️'}</span>
                    <span className={`font-medium ${todo.done ? 'line-through text-slate-500' : 'text-white'}`}>{todo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-yellow-500 font-black mr-2">+{todo.reward}</span>
                    {todo.done ? (
                      <button onClick={() => postData('undone-todo', {index})} className="bg-slate-600 hover:bg-slate-500 text-xs px-3 py-2 rounded font-bold">Unceklis</button>
                    ) : (
                      <button onClick={() => postData('done-todo', {index})} className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-2 rounded font-bold">Ceklis</button>
                    )}
                    <button onClick={() => postData('delete-todo', {index})} className="bg-red-900/50 hover:bg-red-800 text-red-300 text-xs px-3 py-2 rounded font-bold">Hapus</button>
                  </div>
                </div>
              ))}
              {data.todos.length === 0 && <p className="text-center text-slate-500 italic py-6">Tidak ada tugas. Tambahkan tugas baru!</p>}
            </div>
          </div>

          {/* --- Kolom Kanan: REWARD LIST --- */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-3">🎁 Toko Self Reward</h2>
            
            <div className="flex gap-3 mb-8 bg-slate-900 p-3 rounded-xl border border-slate-700">
              <input 
                type="text" placeholder="Reward baru..." 
                className="bg-transparent flex-grow px-2 outline-none"
                value={newReward.name} onChange={e => setNewReward({...newReward, name: e.target.value})}
              />
              <input 
                type="number" placeholder="Harga" 
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 w-28 outline-none"
                value={newReward.price} onChange={e => setNewReward({...newReward, price: parseInt(e.target.value) || 0})}
              />
              <button onClick={addReward} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-lg transition-all">Tambah</button>
            </div>

            <div className="space-y-3">
              {data.rewards.map((reward, index) => (
                <div key={index} className="p-4 bg-slate-900 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✨</span>
                    <span className="font-medium text-blue-200">{reward.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => postData('buy-reward', {index})} className="bg-yellow-600 hover:bg-yellow-500 text-slate-900 text-sm px-4 py-2 rounded-lg font-bold transition-all">
                      Beli ({reward.price})
                    </button>
                    <button onClick={() => postData('delete-reward', {index})} className="bg-red-900/50 hover:bg-red-800 text-red-300 text-xs px-3 py-2 rounded font-bold">Hapus</button>
                  </div>
                </div>
              ))}
              {data.rewards.length === 0 && <p className="text-center text-slate-500 italic py-6">Toko kosong. Tambahkan reward impianmu!</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App