import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { register } from '../api/api';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(username, password);
      console.log('User registered:', response.data);
      // Handle successful registration (e.g., log in the user, redirect)
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (e.g., show error message)
    }
  };

  // ... rest of the component remains the same
};

export default SignUp;