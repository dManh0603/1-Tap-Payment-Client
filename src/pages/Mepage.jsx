import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserState } from '../contexts/UserProvider';
import Banner from '../components/miscellaneous/Banner';
import Profile from '../components/Profile';
import TransferMoney from '../components/TransferMoney';
import TransactionHistory from '../components/TransactionHistory';

const Mepage = () => {

  const navigate = useNavigate();
  const { user } = UserState();

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken === null) return navigate('/');
    console.log('user', user);

  }, []);

  return (
    <>
      {user &&
        <Container maxW='4xl' centerContent>

          <Banner />
          <Tabs w={'100%'}>
            <TabList>
              <Tab>Summary</Tab>
              <Tab>Transfer money</Tab>
              <Tab>Transaction history</Tab>
              <Tab>Other actions</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box w={'100%'}>
                  <Profile user={user} />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box w={'100%'}>
                  <TransferMoney />
                </Box>
              </TabPanel>
              <TabPanel>
                <TransactionHistory />
              </TabPanel>
              <TabPanel>
                <p>Other actions!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Container>

      }
    </>
  )
}

export default Mepage