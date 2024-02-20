import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Flex } from '@chakra-ui/react'
import SideDrawer from '../components/UIComponents/SideDrawer'
import MyChats from '../components/UIComponents/MyChats'
import ChatBox from '../components/UIComponents/ChatBox'

const Chat = () => {
  const  {user} =   ChatState()
  const [fetchAgain,setFetchAgain] = useState(false)
//  console.log(user,'Chats Page')
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