import { Box, Button, Container, Modal, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import Banner from '../components/miscellaneous/Banner';
import axios from 'axios';
import ZaloPay from '../components/ZaloPay';
import { UserState } from '../contexts/UserProvider';
import { formatAmount } from '../helpers/Utils';
import { CloseIcon } from '@chakra-ui/icons';
const Depositpage = () => {

  const userToken = localStorage.getItem('userToken');
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state
  const { user } = UserState();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handlePaypalTransaction = async (captureDetails) => {
    console.log('paypal details captured', captureDetails);
    try {
      const data = {
        payment_id: captureDetails.purchase_units[0].payments.captures[0].id,
        status: captureDetails.purchase_units[0].payments.captures[0].status,
        amount: captureDetails.purchase_units[0].payments.captures[0].amount.value,
        create_time: captureDetails.purchase_units[0].payments.captures[0].create_time,
        update_time: captureDetails.purchase_units[0].payments.captures[0].update_time,
        method: 'PAYPAL',
        payer_id: captureDetails.payer.payer_id,
        email_address: captureDetails.payer.email_address,
        receiver_id: user._id,
        type: 'DEPOSIT',
      };

      const createApiResponse = await axios.post('/api/transaction/paypal/create', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (createApiResponse.status === 200) {
        const transaction = createApiResponse.data;
        console.log('/api/transaction/create data', transaction);

        const payload = {
          amount: transaction.amount,
          transactionId: transaction._id
        };

        const addApiResponse = await axios.put('/api/balance/add', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (addApiResponse.status === 200) {
          console.log('Amount added to balance');
        } else {
          throw new Error('Failed to add amount to balance');
        }

        toast({
          title: 'Transaction completed',
          duration: 5000,
          status: 'success',
          isClosable: true,
          position: 'top-right'
        });
        setTimeout(() => {
          navigate('/me')

        }, 1000)

      } else {
        throw new Error('Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Transaction failed',
        description: error.message,
        duration: 5000,
        status: 'error',
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleCreateOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
          }
        }
      ],
    });
  };

  const handleApprove = async (data, actions) => {
    return actions.order.capture()
      .then(handlePaypalTransaction);
  };

  const handleError = (error) => {
    toast({
      title: 'Error happened. Please contact admin or try again later',
      duration: 5000,
      status: 'error',
      isClosable: true,
      position: 'top-right'
    });
    console.log(error);
  };

  const onCancelClick = () => {
    navigate('/me')
  }

  useEffect(() => {
    if (userToken === null) {
      navigate('/');
    }

  }, [])

  return (
    <>
      <Container maxW='4xl' centerContent>
        <Banner />
        <Box
          bg={'white'}
          w={'100%'}
          borderRadius={'lg'}
          borderWidth={'1px'}
          p={3}
        >
          <Box>
            <Button colorScheme='blue' onClick={onOpen}>
              <CloseIcon />
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>You want to cancel ?</ModalHeader>
                <ModalCloseButton />

                <ModalFooter>
                  <Button colorScheme='red' mr={3} onClick={onCancelClick}>
                    Cancel
                  </Button>
                  <Button variant='ghost' onClick={onClose}>Continue</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Text fontSize={'3xl'} textAlign={'center'}>Bạn đang nạp {formatAmount(amount)} VND vào tài khoản</Text>
          </Box>

          {/* <Profile user={user} /> */}

          <Box mt={3} display={'flex'} alignItems={'center'} flexDirection={'column'}>
            {!isLoading ?
              <Box>
                <ZaloPay amount={amount} callback={setIsLoading} />
                {/* <Text fontSize={'xl'}>Hoặc thanh toán qua:</Text>
                <PayPalScriptProvider
                  options={{
                    'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
                  }}
                >
                  <PayPalButtons
                    createOrder={handleCreateOrder}
                    onApprove={handleApprove}
                    onError={handleError}
                  />
                </PayPalScriptProvider> */}
              </Box>
              :
              <>
                <Spinner display={'block'} thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                <Text fontSize="md">Giao dịch đang được thực hiện, hãy giữ nguyên cửa sổ này.</Text>
                <Text fontSize="md" color={'red'} as={'i'}>Nếu đóng cửa sổ này, giao dịch sẽ bị hủy.</Text>
              </>
            }
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Depositpage