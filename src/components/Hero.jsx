import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* MAIN SLIDESHOW (Takes 8 columns on Desktop) */}
        <div className="lg:col-span-8 relative h-[300px] md:h-[450px] overflow-hidden rounded-[2.5rem] shadow-xl bg-gray-900 group">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img src={slide.img} className="w-full h-full object-cover" alt="Banner" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-6 left-8 flex gap-2">
            {slides.map((_, index) => (
              <div key={index} className={`h-1.5 transition-all duration-500 rounded-full ${index === currentIndex ? "w-8 bg-orange-600" : "w-2 bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* SIDE CARDS (Takes 4 columns on Desktop) */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          
          {/* Card 1: Trending/Promo */}
          <div className="relative h-[150px] lg:h-[217px] rounded-[2.5rem] overflow-hidden bg-orange-600 group shadow-lg">
             <div className="absolute inset-0 p-6 z-10 flex flex-col justify-end">
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Flash Deals</p>
                <h3 className="text-white font-black text-lg leading-tight italic uppercase">Best Price<br/>Guaranteed</h3>
             </div>
             {/* Replace the URL below with a specific image or use slide[1] if available */}
             <img 
               src={slides[1]?.img || slides[0].img} 
               className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
               alt="Side Promo"
             />
          </div>

          {/* Card 2: Support/Category */}
          <div className="relative h-[150px] lg:h-[217px] rounded-[2.5rem] overflow-hidden bg-gray-900 group shadow-lg">
             <div className="absolute inset-0 p-6 z-10 flex flex-col justify-end">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Support</p>
                <h3 className="text-white font-black text-lg leading-tight italic uppercase">24/7 Campus<br/>Delivery</h3>
             </div>
             <img 
               src={slides[2]?.img || slides[0].img} 
               className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" 
               alt="Side Promo"
             />
          </div>

        </div>
      </div>
    </div>
  );
}