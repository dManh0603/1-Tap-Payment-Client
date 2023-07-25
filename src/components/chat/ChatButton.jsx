import { ChatIcon } from '@chakra-ui/icons'
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox'
import { ChatState } from '../../contexts/ChatProvider'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import ChatList from './ChatList'
import ChatSearch from './ChatSearch'


const ChatButton = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedChat, notification } = ChatState();
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const onDrawerClose = () => {
    setSearchValue('')
    setSearchResult([])
    onClose()
  }

  useEffect(() => {
    if (searchValue === '') {
      setSearchResult([])
    }
    return setSearchResult([])
  }, [searchValue])

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
        <NotificationBadge
          count={notification.length}
          effect={Effect.SCALE}
        />
        <ChatIcon />
      </Button>
      <Drawer placement={'left'} onClose={onDrawerClose} isOpen={isOpen} size={'md'}>
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            <ChatSearch searchLoading={searchLoading} setSearchLoading={setSearchLoading} />
          </DrawerHeader>
          {
            (!searchLoading) && (searchResult.length === 0) &&
            <DrawerBody >
              {selectedChat
                ? <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                : <ChatList fetchAgain={fetchAgain} />
              }
            </DrawerBody>
          }
        </DrawerContent>
      </Drawer></>
  )
}

export default ChatButton