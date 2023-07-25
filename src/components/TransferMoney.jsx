import { Box, Button, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Skeleton, Spinner, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import axios from 'axios'
import UserListItem from './profile/UserListItem';
import ScrollableFeed from 'react-scrollable-feed';
import { UserState } from '../contexts/UserProvider'
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const TransferMoney = () => {
  const [searchValue, setSearchValue] = useState('');
  const [amount, setAmount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState(null);
  const storedToken = localStorage.getItem('userToken');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState();
  const [receiver, setReceiver] = useState(null);
  const toast = useToast();
  const { navigate } = UserState();

  const handleClick = () => setShow(!show)

  const handleClose = () => {
    setPassword(null);
    setTransferError(null);
    onClose();
  }

  const transfer = async () => {
    setTransferLoading(true);
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }

      const KEY = process.env.REACT_APP_KEY;
      const receiverId = receiver._id;
      const user_mac = CryptoJS.SHA256(`${KEY}|${amount}|${password}|${receiverId}`).toString();
      const body = {
        password,
        receiverId,
        amount,
        user_mac
      }

      const { data } = await axios.post('/api/balance/transfer', body, config)
      console.log(data);
      handleClose();
      toast({
        title: data.message,
        status: 'success',
        isClosable: true,
        duration: 3000,
        position: 'top-right',
      })
      window.location.reload()
    } catch (error) {
      console.log(error);
      setTransferError(error.response.data.message);
    } finally {
      setTransferLoading(false);
    }
  }

  const handleAmountChange = (value) => {
    const numericValue = value ? parseInt(value.replace(/\s/g, ''), 10) : 0;
    setAmount(numericValue);
  };

  const formatAmount = (value) => {
    return value ? value.toLocaleString().replace(/,/g, ' ') : '0';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }

  const handleSearch = async () => {
    if (!searchValue) {
      toast({
        title: 'Please provide username or email first',
        duration: 3000,
        isClosable: true,
        status: 'error',
        position: 'top-right'
      })
      setSearchResult(null);
      return;
    }
    setSearchLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }

      const { data } = await axios.get(`/api/user/search/${searchValue}`, config);
      setSearchResult(data);
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error:', error);
    } finally {
      setSearchLoading(false)
    }
  };

  useEffect(() => {
    if (searchValue === '') {
      setSearchResult(null)
    }
    return setSearchResult(null)
  }, [searchValue])

  return (
    <>
      <Text fontSize={'2xl'} textAlign={'center'}>Transfer money</Text>
      {/* Search bar */}
      {
        !receiver &&
        <>
          <Text fontSize={'lg'}>Select a receiver</Text>
          <InputGroup>
            <Input mb={3} variant='filled' placeholder='Provide email or username ...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <InputRightElement onClick={handleSearch}>
              <SearchIcon color='gray.500' />
            </InputRightElement>
          </InputGroup>
          {/* Search Result */}
          <Box maxHeight={'25vh'} borderRadius={'lg'}>
            {searchLoading &&
              <Stack>
                <Skeleton height='50px' />
                <Skeleton height='50px' />
                <Skeleton height='50px' />
              </Stack>}
            <ScrollableFeed>
              {
                searchResult?.map(u => (
                  <UserListItem
                    mt={2}
                    key={u._id}
                    user={u}
                    handleFunction={() => { setSearchResult(null); setReceiver(u) }}
                  />
                ))
              }
            </ScrollableFeed>
          </Box>
        </>
      }

      {/* Receiver */}
      {receiver &&
        <>
          <Text fontSize={'lg'}>Transfer to this account: </Text>
          <Box display={'flex'} alignItems={'center'}>
            <UserListItem user={receiver} />
            <Box
              onClick={() => { setReceiver(null); }}
              mb={2}
              borderRadius={'lg'}
              p={'16px'}
              _hover={{
                background: '#38B2AC',
                color: 'white',
              }}>
              <CloseIcon />
            </Box>
          </Box>
        </>
      }

      {/* Amount */}
      {
        receiver &&
        <>
          <Text fontSize={'lg'}>Choose the amount</Text>
          <InputGroup>
            <InputLeftAddon children='VND' />
            <NumberInput
              defaultValue={0}
              min={0}
              keepWithinRange={true}
              clampValueOnBlur={false}
              value={formatAmount(amount)}
              onChange={handleAmountChange}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>

          <Box mt={3}>
            <Button mr={3} colorScheme='blue' onClick={onOpen} isDisabled={amount <= 0}>Transfer</Button>
            <Modal isOpen={isOpen} onClose={handleClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Confirm your transfer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                  <FormControl>
                    <FormLabel>Enter your password: </FormLabel>
                    <InputGroup size='md'>
                      <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter your password'
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                          {show ? 'Hide' : 'Show'}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {transferLoading &&
                      <Box mt={2} display={'flex'} justifyContent={'center'}>
                        <Spinner
                          thickness='4px'
                          speed='0.65s'
                          emptyColor='gray.200'
                          color='blue.500'
                          size='xl'
                        />
                      </Box>
                    }
                    {/* Error display */}
                    <Text size={'md'} as='i' color='red'>{transferError}</Text>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='red' mr={3} onClick={handleClose}>
                    Close
                  </Button>
                  <Button colorScheme='blue' onClick={transfer} isDisabled={!password}>Transfer</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box >
        </>
      }
    </>
  );
};

export default TransferMoney;
