import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx: Starting to render');

const root = document.getElementById('root');

if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log('main.tsx: Rendering completed');
  } catch (error) {
    console.error('Error in main.tsx:', error);
  }
} else {
  console.error('Root element not found');
}