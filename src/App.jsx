import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/AdminDashboard'; 
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

const CATEGORIES = ["All", "Electronics", "Food & Groceries", "Fashion", "Stationery", "Services"];

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i);
      return [...prev, {...product, quantity: 1}];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, amt) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(0, i.quantity + amt)} : i).filter(i => i.quantity > 0));
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
        <Navbar 
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)} 
          user={user} 
          onAuthClick={() => setIsAuthOpen(true)} 
        />
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          updateQuantity={updateQuantity}
          removeFromCart={(id) => setCart(prev => prev.filter(i => i.id !== id))}
          currency={{code: 'GH₵'}} 
        />

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        <Routes>
          <Route path="/" element={
            <div className="flex flex-col w-full">
              {/* Banner Size Fixed Container */}
              <section className="w-full max-w-7xl mx-auto px-4 mt-4 overflow-hidden rounded-[2rem] md:rounded-[3rem]">
                <Hero />
              </section>
              
              <div className="bg-white border-y border-gray-100 py-6 px-4 mt-6 sticky top-[56px] md:top-[64px] z-40 shadow-sm">
                <div className="max-w-7xl mx-auto">
                   <div className="relative mb-6 max-w-2xl mx-auto px-2">
                    <input 
                      type="text" 
                      placeholder="Search campus marketplace..." 
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 outline-none transition-all shadow-inner text-sm"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3 overflow-x-auto no-scrollbar justify-start md:justify-center px-2">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeCategory === cat 
                          ? 'bg-orange-600 text-white shadow-lg' 
                          : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <main className="max-w-7xl mx-auto px-4 py-12 w-full">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                    {filteredProducts.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        addToCart={addToCart} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 italic text-gray-300">
                    No items found
                  </div>
                )}
              </main>

              <Footer />
            </div>
          } />
          
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;