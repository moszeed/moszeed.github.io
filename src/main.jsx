import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const rootNode = document.getElementById('root');

if (rootNode?.hasChildNodes()) {
  rootNode.replaceChildren();
}

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
