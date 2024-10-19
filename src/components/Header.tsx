import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="py-6 border-b border-gray-200 bg-white shadow-sm solid-bg">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Procco
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className={`hover:text-green-600 transition-colors ${location.pathname === '/' ? 'text-green-600' : 'text-gray-600'}`}>Etusivu</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link 
                    to={user.role === 'buyer' ? '/buyer-dashboard' : '/seller-dashboard'} 
                    className={`hover:text-green-600 transition-colors ${
                      location.pathname === '/buyer-dashboard' || location.pathname === '/seller-dashboard' ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {user.role === 'buyer' ? 'Ostajan Hallintapaneeli' : 'Myyjän Hallintapaneeli'}
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Kirjaudu ulos
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/signin" 
                    className={`hover:text-green-600 transition-colors ${location.pathname === '/signin' ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    Kirjaudu sisään
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/signup" 
                    className={`hover:text-green-600 transition-colors ${location.pathname === '/signup' ? 'text-green-600' : 'text-gray-600'}`}
                  >
                    Rekisteröidy
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {user.name}
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;