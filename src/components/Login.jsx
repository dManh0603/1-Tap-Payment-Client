import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserState } from '../contexts/UserProvider'

const Login = () => {

  const [show, setShow] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false);
  const { setUser } = UserState();
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
      };

      const { data } = await axios.post(
        '/api/user/login',
        { email, password },
        config
      );

      setUser(data.user)
      localStorage.setItem('userToken', data.user.token)

      toast({
        title: 'Login successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      navigate('/me')

    } catch (error) {
      console.log(error);
      toast({
        title: error.response.data.message ?? 'Connection error',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <VStack spacing={'5px'}>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder='Enter your email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>


      <Button
        colorScheme='blue'
        w={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  )
}

export default Login