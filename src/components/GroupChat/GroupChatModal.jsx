import { Box, Button, Flex, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import { backendurl } from '../../pages/Home'
import Userslist from '../UIComponents/Userslist'
import UserBadge from './UserBadge'
const GroupChatModal = ({children}) => {
  const  [selectedUsers,setSelectedUsers] = useState([]) 
  const [groupChatName,setGroupChatName] = useState('')
  const [searchUsers,setSearchUsers] = useState("")
  const [searchResults,setSearchResults] = useState([])
  const [loading,setLoading] = useState(false)
  const {isOpen,onOpen,onClose} = useDisclosure()
  const toast =useToast()
  const {user,chats,setChats} = ChatState()

  const handleSearch = async (query) =>{
    setSearchUsers(query)
    if(!query){
      return 
    }
    try{
   setLoading(true)
   const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const {data} = await axios.get(`${backendurl}user?search=${searchUsers}`,config)
  //  console.log(data)
    setLoading(false)
    setSearchResults(data)
    }catch(error){
      toast({
        title: "Error Occred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }
  const handleSubmit = async()=>{
    if(!groupChatName || !selectedUsers){
      toast({
        title: "Pease Select All the Fields",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return
    }

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post(`${backendurl}chat/group`,{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map(e=>e._id))
      },config)

      setChats([data,...chats])
      onClose()
      toast({
        title: "New Group Created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

    }catch(error){
      toast({
        title: "Failed to Create Group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }
  const handleFunction=()=>{}
  const handleDelete=(deleteUser)=>{
   setSelectedUsers(selectedUsers.filter(e=>e._id !== deleteUser._id))
  }
  const handleGroup=(userToAdd)=>{
   // console.log(userToAdd,'usertToAdd')  //function is for adding members to selected group
    if(selectedUsers.includes(userToAdd)){
      toast({
        title: "User Already Added",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return
    }

    setSelectedUsers([...selectedUsers,userToAdd])
  }
  return (
    <>
    <span onClick={onOpen}>{children}</span>
           <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'35px'} textAlign={'center'}>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody >
           <FormControl>
            <Input placeholder='Group Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}></Input>
           </FormControl>
           <FormControl>
            <Input placeholder='Add User to Group' mb={3} onChange={(e)=>handleSearch(e.target.value)} handleFunction={()=>handleGroup(user)}></Input>
           </FormControl>
           <Flex>
           {selectedUsers.map(e=>(
            <UserBadge key={e._id} user={e} handleFunction={()=>handleDelete(e)}/>
           ))}
           </Flex> 
           {
                searchResults?.slice(0,4).map(user=> <Userslist key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>)
           }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='cyan'  onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default GroupChatModal