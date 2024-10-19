import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would validate the credentials here
    const newUser = { id: Date.now().toString(), name: email.split('@')[0], role, email };
    setUser(newUser);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Kirjaudu sisään Proccoon
          </h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Sähköpostiosoite
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full"
                placeholder="Sähköpostiosoite"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Salasana
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input w-full"
                placeholder="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none transition-colors ${
                  role === 'buyer'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setRole('buyer')}
              >
                <UserCircle className="inline-block mr-2" />
                Ostaja
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none transition-colors ${
                  role === 'seller'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setRole('seller')}
              >
                <Briefcase className="inline-block mr-2" />
                Myyjä
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Kirjaudu sisään
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;