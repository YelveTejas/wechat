import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import Singlechat from '../Chatlogic/Singlechat'

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat}=ChatState()
  return (
    <Box display={{base: selectedChat ? "flex" :"none",md:"flex"}}
    alignItems={'center'}
    flexDirection={'column'}
    p={3}
   
    w={{base:"100%",md:"74%"}}  
    borderRadius={'lg'}
    borderWidth={'1px'}
    >
   <Singlechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox