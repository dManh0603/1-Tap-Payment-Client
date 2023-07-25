import { useToast } from '@chakra-ui/react';
import axios from 'axios';
const { createContext, useState, useContext, useEffect } = require("react")
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const storedToken = localStorage.getItem('userToken');
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const toast = useToast();
  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error retrieving your chats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    console.log('chat provider')
  }, [])


  return (
    <ChatContext.Provider value={{
      selectedChat,
      setSelectedChat, chats, setChats,
      notification, setNotification, accessChat
    }}>
      {children}
    </ChatContext.Provider>
  )

}

export const ChatState = () => {

  return useContext(ChatContext)
}


export default ChatProvider;