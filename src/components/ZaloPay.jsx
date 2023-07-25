import { Box, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js';

const ZaloPay = ({ amount, callback }) => {

  const storedToken = localStorage.getItem('userToken');
  const [paymentMethod, setPaymentMethod] = useState('zalopayapp');
  const toast = useToast();
  const navigate = useNavigate();
  const handleRadioChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleClick = async () => {
    callback(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
      const KEY = process.env.REACT_APP_KEY;
      const user_mac = CryptoJS.SHA256(`${KEY}|${amount}|${paymentMethod}`).toString();
      const body = {
        amount,
        paymentMethod,
        user_mac
      }
      console.log(body)
      const transaction = await axios.post('/api/transaction/zalopay/create', body, config)

      if (transaction.status === 200) {
        window.open(transaction.data.order_url, '_blank');

        const transactionData = {
          app_trans_id: transaction.data.app_trans_id
        }

        const { data } = await axios.post('/api/transaction/zalopay/query', transactionData, config);

        if (data === 'SUCCEED') {
          toast({
            title: 'Successfully deposited',
            status: 'success',
            isClosable: true,
            duration: 3000,
            position: 'top-right',
          })
          navigate('/me')
        }
        else {
          toast({
            title: 'Your deposit has been canceled. Please try again.',
            status: 'error',
            isClosable: true,
            duration: 3000,
            position: 'top-right',
          })
          navigate('/me')
        }
      }
      // Open a new tab with the order URL
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      callback(false)
      console.log("end of request")
    }
  }
  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/blue.css" />
      </Helmet>
      <Box >
        <Text fontSize={'xl'}>Vui lòng chọn hình thức thanh toán:</Text>
        <div className="mb-1">
          <label><input value={'zalopayapp'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" defaultChecked /> Ví <img src="/images/logo-zalopay.svg" alt="" style={{ display: "inline" }} /></label>
        </div>
        <div className="mb-1">
          <label><input value={'CC'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" /> Visa, Mastercard, JCB <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <div className="mb-1">
          <label><input value={'ATM'} onChange={handleRadioChange} type="radio" name="iCheck" className="iradio_flat-blue" /> Thẻ ATM <span className="txtGray">(qua cổng ZaloPay)</span></label>
        </div>
        <Button colorScheme='blue' mb={3} onClick={handleClick}>Tiếp tục với ZaloPay</Button>
      </Box>
    </>
  )
}

export default ZaloPay