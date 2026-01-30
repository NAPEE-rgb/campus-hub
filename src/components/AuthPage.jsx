import { useNavigate } from 'react-router-dom';

export default function AuthPage({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    setUser(role); // Usually you'd check a password here
    navigate(role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-80">
        <h2 className="text-2xl font-bold mb-6">Welcome to Jumia</h2>
        <button 
          onClick={() => handleLogin('customer')}
          className="w-full bg-orange-500 text-white py-3 rounded mb-4 font-bold hover:bg-orange-600"
        >
          LOGIN AS CUSTOMER
        </button>
        <button 
          onClick={() => handleLogin('admin')}
          className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded font-bold hover:bg-orange-50"
        >
          LOGIN AS ADMIN
        </button>
      </div>
    </div>
  );
}