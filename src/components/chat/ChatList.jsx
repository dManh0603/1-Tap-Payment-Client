import React, { useEffect, useState } from 'react';
import { Avatar, Box, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../../helpers/ChatHelper';
import { ChatState } from '../../contexts/ChatProvider';
import { UserState } from '../../contexts/UserProvider';

const ChatList = ({ fetchAgain }) => {
  const { user } = UserState();
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const storedToken = localStorage.getItem('userToken');
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        };
        const { data } = await axios.get('/api/chat', config);
        setChats(data);

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
    };

    setLoggedUser(user);
    fetchChats();
  }, [fetchAgain]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    const updatedNotif = notification.filter(n => n.chat._id !== chat._id)
    setNotification(updatedNotif)
  };

  const check = () => {
    console.log(1);
    console.log(notification);
  }

  return (
    <>
      <Box>
        <Text
          fontSize={'30px'}
          // fontFamily="Work sans"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          onClick={check}
        >
          My chats
        </Text>

        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflow="hidden"
        >
          {chats.length > 0
            ? (
              <Stack overflowY="scroll">
                {chats.map((chat) => {
                  let isUnseen = false;
                  try {
                    isUnseen = notification.some((n) => n.chat?._id === chat._id);
                  } catch (error) {
                    console.error('Error occurred while checking notifications:', error);
                  }
                  return (
                    <Box
                      key={chat._id}
                      onClick={() => handleChatClick(chat)}
                      cursor="pointer"
                      bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                      color={selectedChat === chat ? 'white' : 'black'}
                      p={3}
                      borderRadius="lg"
                      display={'flex'}
                    >
                      <Avatar
                        mr={2}
                        size={'sm'}
                        cursor={'pointer'}
                        name={getSender(loggedUser, chat.users)}
                        src={user.avt}
                      />
                      <Text fontSize={'lg'} as={isUnseen ? 'b' : ''}>
                        {isUnseen
                          ? getSender(loggedUser, chat.users) + ' sent you a new message.'
                          : getSender(loggedUser, chat.users)
                        }
                      </Text>
                    </Box>
                  )
                })}
              </Stack>
            )
            : (
              // <ChatLoading />
              <div>
                You have no chats.
              </div>
            )}
        </Box>
      </Box>
    </>
  );
};

export default ChatList;
