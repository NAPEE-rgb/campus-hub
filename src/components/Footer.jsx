import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleJoin = () => {
    if (!email) return alert("Please enter an email address");
    // This triggers the user's email app to send to you
    window.location.href = `mailto:napeestudios04@gmail.com?subject=Newsletter Subscription&body=Please add me to the CampusHub newsletter: ${email}`;
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">
            Campus<span className="text-orange-500">Hub</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The #1 marketplace for students. Buy, sell, and trade essentials with ease across campus.
          </p>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-orange-500">Marketplace</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li className="hover:text-white cursor-pointer transition-colors">Electronics</li>
            <li className="hover:text-white cursor-pointer transition-colors">Fashion</li>
            <li className="hover:text-white cursor-pointer transition-colors">Food & Groceries</li>
            <li className="hover:text-white cursor-pointer transition-colors">Services</li>
          </ul>
        </div>

        {/* Support Column - Admin Link Removed */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-orange-500">Support</h4>
          <ul className="space-y-3 text-sm text-gray-400 font-medium">
            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="font-bold uppercase text-xs tracking-widest mb-6 text-orange-500">Newsletter</h4>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-none rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-1 focus:ring-orange-500" 
            />
            <button 
              onClick={handleJoin}
              className="bg-orange-600 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-orange-500 transition-colors"
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
        <p>© 2026 CampusHub Ghana. Developed by NAPEE STUDIOS.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}