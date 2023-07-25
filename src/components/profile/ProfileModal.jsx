import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { ViewIcon, WarningIcon } from '@chakra-ui/icons'
const ProfileModal = ({ user }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}><ViewIcon /></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={'md'}>Email: {user.email}</Text>
            {user.role === 'admin' && <Text textTransform={'uppercase'} fontSize={'md'}>{user.role}</Text>}
          </ModalBody>
        </ModalContent>
        <ModalFooter>

        </ModalFooter>
      </Modal>
    </>
  )
}

export default ProfileModal