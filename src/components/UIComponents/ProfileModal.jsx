import { Button, IconButton, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { FaEye } from "react-icons/fa";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
const ProfileModal = ({user,children}) => {
const {onOpen,isOpen,onClose} = useDisclosure()
  return (
    <>
     
       {children? (<span onClick={onOpen}>{children}</span>):(
       <FaEye cursor={'pointer'} onClick={onOpen}/>
       )}

     <Modal isOpen={isOpen} onClose={onClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'30px'} fontFamily={'sans-serif'} display={'flex'} justifyContent={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <Image
           borderRadius='full'
           boxSize={'150px'}
           src={user.pic}
           alt={user.name}
           mx='auto'
           />
          <Text textAlign={'center'} mt={3} fontSize={{base:"22px",md:"25px"}}>Email :{user.email}</Text>
          
          </ModalBody>

          <ModalFooter>
            <Button
             colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
       
    </>
  )
}

export default ProfileModal