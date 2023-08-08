import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/profile/TransactionItem';
import { Button, Card, CardBody, Text, Box, CardHeader, Input, HStack } from '@chakra-ui/react';

const TransactionHistory = () => {
  const storedToken = localStorage.getItem('userToken');

  const [refresh, setRefresh] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [selectedDate, setSelectedDate] = useState('');

  const handleSeeAllClick = () => {
    setRefresh(!refresh);
    setSelectedDate('')
  }

  const handleDateChange = async (e) => {
    setSelectedDate(e.target.value)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`
        },
      };
      const { data } = await axios.get('/api/user/transaction/' + e.target.value, config)
      console.log(data)
      setTransactions(data.transactions)
    } catch (error) {
      console.log(error)
    }

  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchUserTransaction = async () => {
      const depositTransaction = await axios.get('/api/transaction/', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setTransactions(depositTransaction.data.transactions);
    };
    fetchUserTransaction();
  }, [refresh]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <Card>
        <CardHeader>
          <Input variant='filled' placeholder='Method ?' type="month" value={selectedDate}
            onChange={handleDateChange}
          />
          <Button mt={3} onClick={handleSeeAllClick}>See all</Button>
        </CardHeader>
        <CardBody>
          {transactions.length === 0 ? (
            <Text fontSize={'lg'}>You have no transactions in this month.</Text>
          ) : (
            <>
              {currentItems.map((transaction, index) => {
                const prevTransaction = index > 0 ? currentItems[index - 1] : null;
                const previousDate = prevTransaction && new Date(prevTransaction.createdAt).toLocaleDateString();
                const currentDate = new Date(transaction.createdAt).toLocaleDateString();

                if (previousDate !== currentDate) {
                  return (
                    <Box key={transaction._id}>
                      <Text fontSize="xl" fontWeight="bold">
                        {currentDate}
                      </Text>
                      <TransactionItem transaction={transaction} />
                    </Box>
                  );
                }

                return (
                  <TransactionItem key={transaction._id} transaction={transaction} />
                );
              })}
              <Box>
                {pageNumbers.map((pageNumber) => (
                  <Button
                    key={pageNumber}
                    mr={2}
                    mt={4}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={currentPage === pageNumber ? 'solid' : 'outle'}
                  >
                    {pageNumber}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default TransactionHistory;
