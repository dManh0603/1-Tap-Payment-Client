import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Input, InputGroup, InputRightElement, Skeleton, Stack, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import UserListItem from '../profile/UserListItem';
import axios from 'axios'
import { ChatState } from '../../contexts/ChatProvider';

const ChatSearch = ({ setSearchLoading, searchLoading }) => {

  const { accessChat } = ChatState();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const storedToken = localStorage.getItem('userToken');
  const toast = useToast();

  

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchChat();
    }
  };

  const searchChat = async () => {
    if (!searchValue) {
      toast({
        title: 'Please enter name or email to search',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setSearchLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
      const { data } = await axios.get(`/api/user/search/${searchValue}`, config);

      if (data.length === 0) {
        toast({
          title: 'No results found',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top-left',
        })
        return;
      }

      setSearchResult(data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something wrong. Please try again later!',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    } finally {
      setSearchLoading(false);
    }
  }

  const handleContactAdmin = () => {
    accessChat('6475d74a202e98a518cbca9b')
  }

  return (
    <>
      <Text>Let's have a conversation.</Text>

      <InputGroup mt={3}>
        <Input placeholder='Search for friends and more ...' size='md'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <InputRightElement>
          <SearchIcon />

        </InputRightElement>
      </InputGroup>

      {searchLoading
        ? <Stack mt={3}>
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
        </Stack>
        : <Box mt={3}>
          <ScrollableFeed>
            {
              searchResult?.map(u => (
                <UserListItem
                  mt={2}
                  key={u._id}
                  user={u}
                  handleFunction={() => { setSearchResult([]); accessChat(u._id) }}
                />
              ))
            }
          </ScrollableFeed>
        </Box>
      }
      <Button color='black' variant={'link'} fontSize={'md'} fontFamily={'Work Sans'} onClick={handleContactAdmin}>Contact admin</Button>
    </>
  )
}

export default ChatSearch