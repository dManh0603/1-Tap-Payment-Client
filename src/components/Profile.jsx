import { Alert, AlertIcon, AlertTitle, Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import DeactivateCardModal from './profile/DeactivateCardModal'
import { useNavigate } from 'react-router-dom';
import { formatAmount } from '../helpers/Utils'
const Profile = ({ user }) => {
  const { isOpen: isDepositOpen, onOpen: onDepositOpen, onClose: onDepositClose } = useDisclosure();
  const [amount, setAmount] = useState(15000);
  const navigate = useNavigate();

  const handleAmountChange = (value) => {
    const numericValue = value ? parseInt(value.replace(/\s/g, ''), 10) : 0;
    setAmount(numericValue);
  };

  const goPay = () => {
    navigate('/me/deposit', {
      state: {
        amount,
      },
    });
  };
  return (
    <>
      <Text fontSize={'2xl'} textAlign={'center'}>Your infomation</Text>
      <Text fontSize={'lg'}>Username</Text>
      <Input mb={3} style={{ opacity: 1 }} variant='filled' placeholder='Username' value={user.name} isDisabled />
      <Text fontSize={'lg'}>Email</Text>
      <Input mb={3} style={{ opacity: 1 }} variant='filled' placeholder='Email' value={user.email} isDisabled />
      <Text fontSize={'lg'}>Balance (VND)</Text>
      <Input mb={3} style={{ opacity: 1 }} variant='filled' placeholder='Balance' value={formatAmount(user.balance)} isDisabled />
      <Text fontSize={'lg'}>Status </Text>
      {user.card_disabled
        ? <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Your card is currently disabled</AlertTitle>
        </Alert>
        : <Alert status='success'>
          <AlertIcon />
          Your card is avaiable
        </Alert>
      }
      <Box mt={3} display={'flex'} justifyContent={'space-between'}>
        {user.card_disabled ? <Text as={'i'}>Contact admin for any help</Text> : <DeactivateCardModal user={user} />}
        <Button mr={3} colorScheme='blue' onClick={onDepositOpen}>Deposit</Button>
        <Modal isOpen={isDepositOpen} onClose={onDepositClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose the amount to deposit</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

              <FormControl>
                <FormLabel>Amount (VND)</FormLabel>
                <NumberInput step={1000} min={15000} value={formatAmount(amount)} onChange={handleAmountChange}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Text as={'i'} color='tomato'>
                Minimum deposit is 15 000 VND
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onDepositClose}>
                Close
              </Button>
              {amount > 0 && (<Button colorScheme='blue' onClick={goPay}>Go to payment</Button>)}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  )
}

export default Profile