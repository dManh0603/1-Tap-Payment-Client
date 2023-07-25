import { Box, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import DrawerButton from './DrawerButton';
import ChatButton from '../chat/ChatButton';

const Banner = () => {

  return (
    <>
      <Box w='100%'>
        <Image src='/banner-yersin.jpg' />
      </Box>
      <Box
        d={'flex'}
        justifyContent={'center'}
        p={3}
        bg={'white'}
        w={'100%'}
        mb={'12px'}
        borderWidth={'1px'}
      >
        <Text fontSize={'4xl'} textAlign={'center'} mb={0}>
          NEU 1-Tap Parking Payment
        </Text>
        <Box display={'flex'} justifyContent={'space-between'}>
          <ChatButton />
          <DrawerButton />
        </Box>
      </Box>
    </>
  )
}

export default Banner