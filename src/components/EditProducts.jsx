import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function EditProducts() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [tempData, setTempData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setTempData({ name: product.name, price: product.price });
  };

  const handleSave = async (id) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: tempData.name,
        price: Number(tempData.price)
      });
      setEditingId(null);
      alert("Changes saved!");
    } catch (err) {
      alert("Error updating: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this item?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-orange-600">
      Loading Inventory...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black uppercase italic">
          Manage <span className="text-orange-600">Inventory</span>
        </h2>
        <Link to="/admin" className="text-xs font-black uppercase bg-gray-100 px-4 py-2 rounded-xl">
          ← Back to Dashboard
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No products found to edit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex gap-4 items-center">
              <img src={p.img} className="w-24 h-24 rounded-3xl object-cover border border-gray-50" alt="" />
              
              <div className="flex-1">
                {editingId === p.id ? (
                  <div className="space-y-3">
                    <input 
                      className="w-full text-sm font-bold p-2 bg-gray-50 rounded-lg outline-none border-b-2 border-orange-500" 
                      value={tempData.name} 
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                    />
                    <input 
                      className="w-full text-sm font-black text-orange-600 p-2 bg-gray-50 rounded-lg outline-none" 
                      type="number" 
                      value={tempData.price} 
                      onChange={(e) => setTempData({...tempData, price: e.target.value})}
                    />
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => handleSave(p.id)} className="flex-1 bg-orange-600 text-white py-2 rounded-xl text-[10px] font-black uppercase">Save</button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-xl text-[10px] font-black uppercase">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{p.name}</h3>
                    <p className="text-orange-600 font-black text-sm mb-3">GH₵ {p.price}</p>
                    <div className="flex gap-4 border-t border-gray-50 pt-3">
                      <button onClick={() => handleEdit(p)} className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-700">Edit Details</button>
                      <button onClick={() => handleDelete(p.id)} className="text-[10px] font-black uppercase text-red-400 hover:text-red-600">Delete Item</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}