import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// The "export default" here is what fixes your blank screen error!
export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // --- REGISTRATION LOGIC ---
        const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Update user profile with full name
        await updateProfile(userCred.user, { 
          displayName: `${formData.firstName} ${formData.lastName}` 
        });

        // Store user data in Firestore "users" collection
        await setDoc(doc(db, "users", userCred.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          createdAt: new Date(),
          role: 'user' // Default role
        });
      }
      onClose(); // Close modal on success
    } catch (err) {
      // Clean up Firebase error messages
      setError(err.message.replace("Firebase: ", "").replace(/\(auth.*\)./, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 text-2xl transition-colors"
        >
          &times;
        </button>
        
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">
            {isLogin ? "Welcome" : "Join"}<span className="text-orange-600">Hub</span>
          </h2>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            {isLogin ? "Log in to your campus account" : "Create your student account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="First Name" 
                required 
                className="w-full p-4 rounded-2xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-gray-100" 
                onChange={(e)=>setFormData({...formData, firstName: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                required 
                className="w-full p-4 rounded-2xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-gray-100" 
                onChange={(e)=>setFormData({...formData, lastName: e.target.value})} 
              />
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            className="w-full p-4 rounded-2xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-gray-100" 
            onChange={(e)=>setFormData({...formData, email: e.target.value})} 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="w-full p-4 rounded-2xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all border border-gray-100" 
            onChange={(e)=>setFormData({...formData, password: e.target.value})} 
          />
          
          {error && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-100">
              <p className="text-red-600 text-[10px] font-bold uppercase leading-tight">{error}</p>
            </div>
          )}
          
          <button 
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
          >
            {loading ? "Please Wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already a member? Log In"}
        </button>
      </div>
    </div>
  );
}