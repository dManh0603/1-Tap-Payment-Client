import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { convertToGMT7, formatAmount } from '../../helpers/Utils';

const TransactionItem = ({ transaction }) => {
  return (
    <Box my={3}>
      {transaction && transaction.type === 'TRANSFER'
        ? <>
          <Heading size='sm' textTransform='uppercase'>
            You transfer {formatAmount(transaction.amount)} VND to {transaction.receiver.name}
          </Heading>
          <Text fontSize='sm'>
            Transactions id: {transaction._id}
            <br />
            Receiver email: {transaction.receiver.email}
            <br />
            Status: {transaction.status}
            <br />
            {convertToGMT7(transaction.createdAt)}
          </Text>
        </>
        : <>
          <Heading size='sm' textTransform='uppercase'>
            You deposited {formatAmount(transaction.amount)} VND
          </Heading>
          <Text fontSize='sm'>
            Transactions id: {transaction._id}
            <br />
            Method: {transaction.method}
            <br />
            Status: {transaction.status}
            <br />
            {convertToGMT7(transaction.createdAt)}
          </Text>
        </>}

    </Box>
  )
}

export default TransactionItem