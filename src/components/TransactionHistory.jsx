import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionItem from '../components/profile/TransactionItem';
import { Button, Card, CardBody, Stack, StackDivider, Text, Box, CardHeader, Input, HStack } from '@chakra-ui/react';

const TransactionHistory = () => {
  const userToken = localStorage.getItem('userToken');

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchUserTransaction = async () => {
      const depositTransaction = await axios.get('/api/transaction/', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setTransactions(depositTransaction.data.transactions);
    };
    fetchUserTransaction();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <Card>
        <CardHeader>
          <HStack spacing={4}>
            <Text>Search for anything ?</Text>
            <Input variant='filled' placeholder='Method ?' type="date" />
          </HStack>
        </CardHeader>
        <CardBody>
          {transactions.length === 0 ? (
            <Text fontSize={'lg'}>You have no recent transactions.</Text>
          ) : (
            <>
              {currentItems.map((transaction, index) => {
                const prevTransaction = index > 0 ? currentItems[index - 1] : null;
                const previousDate = prevTransaction && new Date(prevTransaction.createdAt).toLocaleDateString();
                const currentDate = new Date(transaction.createdAt).toLocaleDateString();

                if (previousDate !== currentDate) {
                  return (
                    <>
                      <Text fontSize="xl" fontWeight="bold">
                        {currentDate}
                      </Text>
                      <TransactionItem key={transaction._id} transaction={transaction} />
                    </>
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
                    variant={currentPage === pageNumber ? 'solid' : 'outline'}
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
