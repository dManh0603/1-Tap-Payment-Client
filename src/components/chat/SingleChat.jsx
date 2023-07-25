import React, { useEffect, useState } from 'react'
import { ChatState } from '../../contexts/ChatProvider'
import { Box, FormControl, IconButton, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getSenderFull, getSender } from '../../helpers/ChatHelper'
import ProfileModal from '../profile/ProfileModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import { UserState } from '../../contexts/UserProvider'
const ENDPOINT = 'http://localhost:3000';

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConented, setSocketConented] = useState(false)
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = UserState();
  const toast = useToast();

  const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const storedToken = localStorage.getItem('userToken');

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: 'Error retrieving your chats',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });

    }
  }

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {

      socket.emit('stop typing', selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          }
        }

        setNewMessage('');
        const { data } = await axios.post('/api/message', {
          content: newMessage,
          chatId: selectedChat._id,

        }, config);

        socket.emit('new message', data)

        setMessages([...messages, data]);

      } catch (error) {
        console.log(error);
        toast({
          title: 'Error retrieving your chats',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom-left',
        });

      }
    }

  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConented) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }

    }, timerLength)
  }

  useEffect(() => {
    const updateSeenChat = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        };

        const requestData = {
          chatId: selectedChat._id,
        };

        const { data } = await axios.put('/api/chat/seen', requestData, config);
        console.log('seen chat id', selectedChat._id);
        console.log('seen chat', data);
      } catch (error) {
        console.log('cant update');
        console.log(error);
      }
    };

    console.log('selectedChat:', selectedChat);
    console.log('loading:', loading);

    if (!loading && selectedChat) {
      console.log('Calling updateSeenChat');
      updateSeenChat();
    }

  }, [selectedChat]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConented(true));
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages();
    console.log(selectedChat)
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage])
      }
    })
  })


  return (<>
    {selectedChat ? (
      <>
        <Text
          fontSize={{ base: '28px', md: '32px' }}
          pb={3}
          px={2}
          w={'100%'}
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={{ base: 'space-between' }}
          alignItems={'center'}
        >
          <IconButton
            display={{ base: 'flex' }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat('')}
          />
          {getSender(user, selectedChat.users)}
          <ProfileModal user={getSenderFull(user, selectedChat.users)} />

        </Text>
        <Box
          display={'flex'}
          flexDir={'column'}
          justifyContent={'flex-end'}
          p={2}
          bg={'#E8E8E8'}
          w={'100%'}
          h={'100%'}
          borderRadius={'lg'}
          overflowY={'hidden'}
        >
          {loading
            ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
              />
            )
            : (
              <>
                <div className='messages'>
                  <ScrollableChat messages={messages} />
                </div>

                <FormControl onKeyDown={sendMessage}>
               

                  <InputGroup mt={2}>
                    <Input
                      // mt={2}
                      bg={'white'}
                      placeholder='Type here ...'
                      onChange={typingHandler}
                      value={newMessage}
                    />
                    <InputRightElement onClick={() => { sendMessage({ key: 'Enter' }) }} className='text-hover'>
                      <ArrowForwardIcon color='green.500' boxSize={6} />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </>
            )}

        </Box>
      </>
    ) : (
      <Spinner
        size={'xl'}
        w={20}
        h={20}
        alignSelf={'center'}
        margin={'auto'}
      />
    )}
  </>)
}

export default SingleChat