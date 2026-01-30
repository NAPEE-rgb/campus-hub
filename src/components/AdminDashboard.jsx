import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, onSnapshot, doc, getDoc, addDoc, 
  updateDoc, deleteDoc, serverTimestamp, query, orderBy 
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [showRevenue, setShowRevenue] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newP, setNewP] = useState({ name: '', price: '', category: 'Electronics', img: '' });
  const [editingId, setEditingId] = useState(null);
  const [inventorySearch, setInventorySearch] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") setIsAdminLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn) return;
    onSnapshot(collection(db, "products"), (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (s) => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    onSnapshot(collection(db, "users"), (s) => setUserCount(s.docs.length));
    onSnapshot(collection(db, "banners"), (s) => setBanners(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [isAdminLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const docSnap = await getDoc(doc(db, "adminSettings", "credentials"));
    if (docSnap.exists() && loginEmail === docSnap.data().email && loginPass === docSnap.data().password) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin_auth", "true");
    } else { setAuthError("Access Denied"); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!newP.img) return alert("Select an image!");
    setIsUploading(true);
    await addDoc(collection(db, "products"), { ...newP, price: Number(newP.price), createdAt: serverTimestamp() });
    setNewP({ name: '', price: '', category: 'Electronics', img: '' });
    setIsUploading(false);
  };

  const saveEdit = async (id, updatedData) => {
    await updateDoc(doc(db, "products", id), updatedData);
    setEditingId(null);
  };

  const deleteProduct = async (id) => { if(window.confirm("Delete?")) await deleteDoc(doc(db, "products", id)); };
  const updateStatus = async (id, status) => await updateDoc(doc(db, "orders", id), { deliveryStatus: status });
  const addBanner = async (e) => {
    const reader = new FileReader();
    reader.onload = async () => await addDoc(collection(db, "banners"), { img: reader.result, createdAt: serverTimestamp() });
    reader.readAsDataURL(e.target.files[0]);
  };
  const deleteBanner = async (id) => await deleteDoc(doc(db, "banners", id));

  const totalRev = orders.reduce((a, b) => a + (b.total || 0), 0);
  const filteredInventory = products.filter(p => p.name.toLowerCase().includes(inventorySearch.toLowerCase()));

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115] p-6">
        <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl">
          <h2 className="text-3xl font-black uppercase italic text-center mb-8 tracking-tighter">HUB <span className="text-orange-600">OS</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="ADMIN EMAIL" className="w-full p-5 rounded-2xl bg-gray-50 text-xs font-bold outline-none border border-transparent focus:border-orange-500 transition-all" onChange={e => setLoginEmail(e.target.value)} />
            <input type="password" placeholder="PASSKEY" className="w-full p-5 rounded-2xl bg-gray-50 text-xs font-bold outline-none border border-transparent focus:border-orange-500 transition-all" onChange={e => setLoginPass(e.target.value)} />
            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col lg:flex-row">
      
      {/* SIDEBAR */}
      <div className="w-full lg:w-72 bg-white p-8 border-r border-gray-100 flex flex-col">
        <h1 className="text-2xl font-black uppercase italic mb-10 tracking-tighter">HUB <span className="text-orange-600">OS</span></h1>
        <nav className="space-y-6 flex-1">
          <div className="p-4 bg-gray-900 text-white rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95" onClick={() => setShowRevenue(!showRevenue)}>
            <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">Revenue Status</p>
                <span className="text-[10px]">{showRevenue ? '👁️' : '🔒'}</span>
            </div>
            <p className="text-xl font-black italic">{showRevenue ? `GHS ${totalRev.toLocaleString()}` : '••••••••'}</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-gray-400">Database Users</p>
            <p className="text-xl font-black text-gray-800 italic">{userCount}</p>
          </div>
        </nav>
        <button onClick={() => {sessionStorage.removeItem("admin_auth"); window.location.reload();}} className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors mt-4">Terminate Session</button>
      </div>

      <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* MEDIA ASSETS */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black uppercase italic text-sm">Media <span className="text-orange-600">Assets</span></h3>
              <label className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer hover:bg-orange-100 transition-all">
                UPLOAD BANNER +
                <input type="file" className="hidden" accept="image/*" onChange={addBanner} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {banners.map(b => (
                <div key={b.id} className="relative aspect-square group overflow-hidden rounded-2xl">
                  <img src={b.img} className="w-full h-full object-cover" />
                  <button onClick={() => deleteBanner(b.id)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black text-[9px]">REMOVE</button>
                </div>
              ))}
            </div>
          </div>

          {/* DEPLOY PRODUCT */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="font-black uppercase italic text-sm mb-6">Deploy <span className="text-orange-600">Product</span></h3>
            <form onSubmit={addProduct} className="grid grid-cols-2 gap-4">
              <input placeholder="Product Name" className="col-span-2 p-4 bg-gray-50 rounded-xl text-xs font-bold outline-none" value={newP.name} onChange={e => setNewP({...newP, name: e.target.value})} required />
              <input type="number" placeholder="Price (GHS)" className="p-4 bg-gray-50 rounded-xl text-xs font-bold outline-none" value={newP.price} onChange={e => setNewP({...newP, price: e.target.value})} required />
              <select className="p-4 bg-gray-50 rounded-xl text-[10px] font-black uppercase outline-none" value={newP.category} onChange={e => setNewP({...newP, category: e.target.value})}>
                <option>Electronics</option><option>Food & Groceries</option><option>Fashion</option><option>Services</option>
              </select>
              <div className="col-span-2 relative h-14 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-orange-400 transition-colors">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={e => {
                  const r = new FileReader(); r.onload = () => setNewP({...newP, img: r.result}); r.readAsDataURL(e.target.files[0]);
                }} />
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{newP.img ? "✅ Image Ready" : "Select Product Image"}</p>
              </div>
              <button className="col-span-2 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg shadow-orange-100">Sync to Market</button>
            </form>
          </div>
        </div>

        {/* LIVE INVENTORY (WITH ZOOM EFFECT) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h3 className="font-black uppercase italic text-sm">Live <span className="text-orange-600">Inventory</span></h3>
              <div className="relative">
                <input type="text" placeholder="SEARCH STOCK..." className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase px-5 py-3 rounded-xl w-full md:w-64 outline-none focus:border-orange-500 transition-all" value={inventorySearch} onChange={(e) => setInventorySearch(e.target.value)} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredInventory.map(p => (
                <div key={p.id} className="relative z-0 bg-gray-50 p-4 rounded-[2rem] border border-gray-100 transition-all duration-300 
                                          hover:z-50 hover:scale-[1.2] hover:shadow-2xl hover:bg-white
                                          active:z-50 active:scale-[1.2] active:shadow-2xl active:bg-white">
                  <img src={p.img} className="w-full h-24 object-cover rounded-2xl mb-4" />
                  {editingId === p.id ? (
                    <div className="space-y-2">
                      <input className="w-full text-[10px] p-2 rounded-lg border border-gray-200 outline-none" value={p.name} onChange={e => saveEdit(p.id, {name: e.target.value})} />
                      <input className="w-full text-[10px] p-2 rounded-lg border border-gray-200 outline-none font-black" type="number" value={p.price} onChange={e => saveEdit(p.id, {price: Number(e.target.value)})} />
                      <button onClick={() => setEditingId(null)} className="w-full py-2 bg-green-500 text-white text-[8px] font-black rounded-lg uppercase">Update</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] font-black uppercase truncate">{p.name}</p>
                      <p className="text-xs font-black text-orange-600 mt-1">GHS {p.price}</p>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => setEditingId(p.id)} className="text-[8px] font-black text-gray-400 hover:text-black uppercase">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-[8px] font-black text-red-300 hover:text-red-600 uppercase">Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
        </div>

        {/* MASTER LOGS */}
        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-8 bg-gray-900 text-white">
              <h3 className="font-black uppercase italic text-sm tracking-widest">Master Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[9px] font-black uppercase text-gray-400">
                    <th className="p-8">Customer</th><th className="p-8">Contact</th><th className="p-8">Location</th><th className="p-8">Products (Hold to Zoom)</th><th className="p-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map(o => (
                    <tr key={o.id} className="text-xs hover:bg-orange-50/20 transition-colors">
                      <td className="p-8">
                        <p className="font-black">{o.email}</p>
                        {showRevenue && <p className="text-[9px] font-black text-orange-600 mt-1 uppercase italic">GHS {o.total}</p>}
                      </td>
                      <td className="p-8 font-black text-gray-500">{o.phone || "---"}</td>
                      <td className="p-8 uppercase font-black italic">{o.location || "N/A"}</td>
                      <td className="p-8 relative">
                         <div className="flex flex-col gap-1 w-[120px] transition-all duration-300 origin-left 
                                       md:hover:scale-[1.8] md:hover:z-50 md:hover:bg-white md:hover:p-2 md:hover:rounded-xl md:hover:shadow-2xl
                                       active:scale-[1.4] active:z-50 active:bg-white active:p-2 active:rounded-xl active:shadow-2xl">
                            {o.items?.map((item, idx) => (
                              <span key={idx} className="bg-gray-900 text-white text-[7px] font-black px-2 py-1 rounded border border-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                                {item.name || "Unknown Product"}
                              </span>
                            ))}
                         </div>
                      </td>
                      <td className="p-8">
                        <select className="p-2 border border-gray-100 rounded-lg text-[9px] font-black uppercase outline-none" value={o.deliveryStatus || "Pending"} onChange={(e) => updateStatus(o.id, e.target.value)}>
                          <option value="Pending">Pending</option><option value="In Transit">In Transit</option><option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
}