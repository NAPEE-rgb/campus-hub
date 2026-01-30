import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, user, onAuthClick }) {
  const [deliveryInfo, setDeliveryInfo] = useState({ phone: '', location: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const saveOrderToFirebase = async (reference) => {
    try {
      await addDoc(collection(db, "orders"), {
        email: user.email,
        userId: user.uid,
        phone: deliveryInfo.phone,
        location: deliveryInfo.location,
        total: totalPrice,
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        reference: reference,
        status: "Paid",
        deliveryStatus: "Pending",
        createdAt: serverTimestamp(),
      });
      alert("🎉 Order Confirmed! We will contact you shortly.");
      onClose();
      window.location.reload();
    } catch (err) {
      alert("Payment successful, but database failed. Keep your reference: " + reference);
    }
  };

  const handlePaystackPayment = () => {
    if (!deliveryInfo.phone || !deliveryInfo.location) {
      alert("Please provide your phone and location for delivery!");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_live_21389645ae0ae2eadb7b6e33b61307e1887da7a2', // ⚠️ REPLACE WITH YOUR KEY
      email: user.email,
      amount: Math.round(totalPrice * 100),
      currency: 'GHS',
      callback: function(response) {
        saveOrderToFirebase(response.reference);
      },
      onClose: () => alert("Transaction Cancelled")
    });
    handler.openIframe();
  };

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isOpen ? "visible" : "invisible"}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-black uppercase italic">Your <span className="text-orange-600">Cart</span></h2>
            <button onClick={onClose} className="p-2 text-gray-400">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                <img src={item.img} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1 text-[10px] font-bold uppercase">{item.name}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white rounded shadow">-</button>
                  <span className="text-xs font-black">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white rounded shadow">+</button>
                </div>
              </div>
            ))}

            {user && cart.length > 0 && (
              <div className="pt-6 space-y-3">
                <p className="text-[10px] font-black uppercase text-black-400">Delivery Information</p>
                <input 
                  type="tel" placeholder="WhatsApp Number/Contact" 
                  className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none focus:ring-1 focus:ring-orange-500"
                  value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})}
                />
                <input 
                  type="text" placeholder="delivery location" 
                  className="w-full p-4 bg-gray-50 rounded-xl text-xs outline-none focus:ring-1 focus:ring-orange-500"
                  value={deliveryInfo.location} onChange={e => setDeliveryInfo({...deliveryInfo, location: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="p-8 border-t">
            <div className="flex justify-between mb-6 font-black italic">
              <span>TOTAL</span>
              <span>GHS {totalPrice.toFixed(2)}</span>
            </div>
            {!user ? (
              <button onClick={onAuthClick} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase text-[10px]">Login to Checkout</button>
            ) : (
              <button onClick={handlePaystackPayment} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Payment</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}