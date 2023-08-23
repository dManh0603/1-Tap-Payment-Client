/* eslint-disable jsx-a11y/anchor-is-valid */

import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage'
import Mepage from './pages/Mepage'
import Depositpage from './pages/Depositpage';
import './App.css';
import { useEffect, useState } from 'react';
import { UserState } from './contexts/UserProvider';
import { ChatState } from './contexts/ChatProvider';
import io from 'socket.io-client'
import axios from 'axios';
import _404 from './components/_404';

const ENDPOINT = process.env.SERVER_ENDPOINT;
let socket, selectedChatCompare;
socket = io(ENDPOINT);

function App() {

  const { user } = UserState();
  const [socketConennected, setSocketConennected] = useState(false)
  const { notification, setNotification } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const storedToken = localStorage.getItem('userToken');

  useEffect(() => {
    if (user) {
      console.log('app setup');
      socket.emit('setup', user);
      socket.on('connected', () => setSocketConennected(true));
    }
  }, [user])

  useEffect(() => {
    const fetchUnseenChats = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }
      try {
        const { data } = await axios.get('/api/chat/unseen', config)
        console.log('unseen chat', data);
        setNotification([...data, ...notification]);
      } catch (error) {
        console.log(error);
      }
    }
    if (!storedToken) return;

    fetchUnseenChats();

  }, [])

  useEffect(() => {
    if (!socketConennected) return;
    socket.on('message received', (newMessage) => {
      console.log('message received')
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
    })
  }, [socketConennected])

  return (
    <div className="App">
      {user
        ?
        <Routes>
          <Route path="/me/deposit" Component={Depositpage}></Route>
          <Route path="/" Component={Mepage}></Route>

          <Route path="*" Component={_404}></Route>

        </Routes>
        :
        <Routes>
          <Route path="/" Component={Homepage}></Route>
          <Route path="*" Component={_404}></Route>

        </Routes>
      }
    </div>
  );
}
export default App;
