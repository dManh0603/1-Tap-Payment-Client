import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './contexts/ChatProvider';
import UserProvider from './contexts/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </UserProvider>
  </BrowserRouter>
);

