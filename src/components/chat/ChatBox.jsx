import React from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../../contexts/ChatProvider'
import SingleChat from './SingleChat';
const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems={'center'}
      flexDir={'column'}
      bg={'white'}
      pb={4}
      w={'100%'}
      h={'100%'}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox