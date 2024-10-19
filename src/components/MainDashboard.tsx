import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, Users, MessageSquare, Zap, Shield, Target, Globe, Clock, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const searchExamples = [
  "Haluan kilpailuttaa yritykseni puhelinliittymät",
  "Yritykseni etsii kirjanpitäjää Helsingistä",
  "Tarvitsemme IT-tukipalveluita 50 hengen toimistolle",
  "Etsimme markkinointitoimistoa brändiuudistukseen",
  "Haemme toimittajaa 1000 kpl mainostuotteille"
];

const howItWorks = [
  {
    title: "Kerro tarpeesi",
    description: "Kuvaile palvelutarpeesi yksityiskohtaisesti.",
    icon: <FileText className="w-10 h-10 text-green-500" />
  },
  {
    title: "Tarkenna pyyntöäsi",
    description: "Vastaa AI:n luomiin tarkentaviin kysymyksiin.",
    icon: <MessageSquare className="w-10 h-10 text-green-500" />
  },
  {
    title: "Saa tarjouksia",
    description: "Vastaanota tarjouksia päteviltä palveluntarjoajilta.",
    icon: <Users className="w-10 h-10 text-green-500" />
  },
  {
    title: "Valitse paras",
    description: "Vertaile tarjouksia ja valitse sopivin kumppani.",
    icon: <CheckCircle className="w-10 h-10 text-green-500" />
  }
];

const benefits = [
  {
    title: "Johtavat toimittajat",
    description: "Verkostossamme on johtavia toimittajia kaikista mahdollisista kategorioista.",
    icon: <Users className="w-8 h-8 text-blue-500" />
  },
  {
    title: "Nopeat vastaukset",
    description: "Saat aina tarjouksia 1-2 arkipäivän kuluessa pyynnöstäsi.",
    icon: <Clock className="w-8 h-8 text-green-500" />
  },
  {
    title: "Täysin ilmaista",
    description: "Palvelu on täysin ilmainen asiakkaille.",
    icon: <Zap className="w-8 h-8 text-yellow-500" />
  },
  {
    title: "Anonyymi prosessi",
    description: "Pysyt anonyyminä koko hankintaprosessin ajan.",
    icon: <Lock className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Älykäs AI-avustaja",
    description: "Hyödynnä tekoälyä palvelupyyntöjen tarkentamisessa ja yhteenvedoissa.",
    icon: <Shield className="w-8 h-8 text-purple-500" />
  },
  {
    title: "Suomalainen alusta",
    description: "Procco on suunniteltu erityisesti Suomen B2B-markkinoille.",
    icon: <Target className="w-8 h-8 text-red-500" />
  }
];

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [displayedSearch, setDisplayedSearch] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTyping) {
        if (displayedSearch.length < searchExamples[currentSearchIndex].length) {
          setDisplayedSearch(prev => prev + searchExamples[currentSearchIndex][prev.length]);
        } else {
          setIsTyping(false);
          setTimeout(() => {
            setIsTyping(true);
            setCurrentSearchIndex((prevIndex) => (prevIndex + 1) % searchExamples.length);
            setDisplayedSearch('');
          }, 2000);
        }
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentSearchIndex, displayedSearch, isTyping]);

  return (
    <div className="container py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-500 to-green-600 text-transparent bg-clip-text">
          Tervetuloa Proccoon
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Tehokas B2B-hankinta-alusta: Pyydä tarjouksia, vertaile ja valitse parhaat toimittajat
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto glass-effect rounded-2xl p-8 shadow-xl mb-16"
      >
        <div className="bg-white rounded-xl p-6 h-24 flex items-center justify-center overflow-hidden shadow-inner">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentSearchIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-xl text-green-600 font-medium"
            >
              {displayedSearch}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mb-16"
      >
        {user ? (
          <button
            onClick={() => navigate(user.role === 'buyer' ? '/create-request' : '/seller-dashboard')}
            className="btn btn-primary inline-flex items-center text-lg px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            {user.role === 'buyer' ? 'Luo Palvelupyyntö' : 'Selaa Palvelupyyntöjä'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/signin')}
            className="btn btn-primary inline-flex items-center text-lg px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Kirjaudu sisään aloittaaksesi
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Miten Procco toimii?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              className="feature-card glass-effect float-animation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex flex-col items-center text-center">
                {step.icon}
                <h3 className="text-xl font-semibold my-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Proccon edut</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MainDashboard;