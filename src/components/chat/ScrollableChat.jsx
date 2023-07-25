import React from 'react'
import { isLastMessage, isSameSender, isSameSenderMargin } from '../../helpers/ChatHelper'
import ScrollableFeed from 'react-scrollable-feed'
import { Avatar, Tooltip } from '@chakra-ui/react';
import { UserState } from '../../contexts/UserProvider';


const ScrollableChat = ({ messages }) => {

  const { user } = UserState();
  if (!messages) return null;

  return <ScrollableFeed>
    {messages && messages.map((message, i) => (

      <div style={{ display: 'flex' }} key={i}>
        {
          (isSameSender(messages, message, i, user._id)
            || isLastMessage(messages, i, user._id)
          )
          && (
            <Tooltip
              label={message.sender.name}
              placement='bottom-start'
              hasArrow
            >
              <Avatar
                mt={'7px'}
                mr={1}
                mb={1}
                size={'sm'}
                cursor={'pointer'}
                name={message.sender.name}
                src={message.sender.avt}
              />
            </Tooltip>
          )}

        <span
          style={{
            backgroundColor: `${message.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
            borderRadius: '16px',
            padding: '4px 16px',
            maxWidth: '75%',
            marginLeft: isSameSenderMargin(messages, message, i, user._id),
            marginBottom: '2px'
          }}

        > {message.content}</span>
      </div>
    ))}
  </ScrollableFeed>
}

export default ScrollableChat