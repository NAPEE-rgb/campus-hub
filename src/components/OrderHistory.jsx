import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    return onSnapshot(q, s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-black uppercase italic mb-8">My <span className="text-orange-600">Purchases</span></h2>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase">GHS {o.total}</p>
              <h4 className="font-black text-sm uppercase italic mt-1">{o.deliveryStatus || 'Processing'}</h4>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase">{o.location}</p>
              <div className="flex gap-1 mt-2">
                {o.items?.map((i, idx) => <span key={idx} className="bg-gray-50 px-2 py-1 rounded text-[8px] font-black uppercase">{i.name}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}