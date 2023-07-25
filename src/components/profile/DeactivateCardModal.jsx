import { WarningIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const DeactivateCardModal = ({ user }) => {
  const { isOpen: isCardDeactivateOpen, onOpen: onCardDeactivateOpen, onClose: onCardDeactivateClose } = useDisclosure();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const storedToken = localStorage.getItem('userToken');
  const toast = useToast();
  const navigate = useNavigate();
  
  const handleDeactivateCard = async () => {
    console.log('handleDeactivate')
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      }
      const body = {
        password
      }
      const { data } = await axios.put('/api/card/disable', body, config)
      console.log(data);
      toast({
        title: data.message,
        status: 'success',
        position: 'top-right',
        isClosable: true,
        duration: 5000,
      })
      navigate('/me');
    } catch (error) {
      setErrorMsg(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      onCardDeactivateClose();
    }
  }

  return (
    <>
      <Button mr={3} colorScheme='red' onClick={onCardDeactivateOpen}>Disable your card</Button>
      <Modal isOpen={isCardDeactivateOpen} onClose={onCardDeactivateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><WarningIcon color={'red.500'} /> You are disabling your card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Please enter the password for '<span style={{ color: 'red' }}>{user.email}</span>'</FormLabel>
              <Input type='password' onChange={(e) => { setPassword(e.target.value) }} />
              <FormHelperText>You need to contact admin to reactivate your card!</FormHelperText>
              <FormHelperText color={'red'}>{errorMsg}</FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onCardDeactivateClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={handleDeactivateCard}>Disable</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeactivateCardModal