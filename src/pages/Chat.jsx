import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../Context/ChatProvider'
import { Box, Flex } from '@chakra-ui/react'
import SideDrawer from '../components/UIComponents/SideDrawer'
import MyChats from '../components/UIComponents/MyChats'
import ChatBox from '../components/UIComponents/ChatBox'

const Chat = () => {
  const { user, authChecked } = ChatState()
  const navigate = useNavigate()
  const [fetchAgain,setFetchAgain] = useState(false)

  useEffect(() => {
    if (authChecked && !user) navigate('/')
  }, [authChecked, user, navigate])
  return (
    <Box w='100%'>
      { user && <SideDrawer/>}
      <Flex justifyContent={'space-between'} w='100%' h='90vh' p='10px'>
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Flex>
    </Box>
  )
}

export default Chat