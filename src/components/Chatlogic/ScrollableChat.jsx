import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { ChatState } from "../../Context/ChatProvider";
import { convertTimestampToTime } from "../../config/Chatlogic";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
//console.log(messages,'messages')
  return (
    <>
      {messages &&
        messages.map((message, index) => (
         
          <Flex key={message._id} mb={'3px'}px={3}>
      
            {message.sender._id === user._id ? (
              <Flex ml="auto" bgColor={"#B9F5D0"} gap={2} h='auto' p='2px 5px' maxW={'60%'} borderRadius={'2xl'}>
                <Text textAlign={'justify'} >{message.content}</Text>
                <Text alignSelf={'flex-end'} fontSize={'12px'}>{convertTimestampToTime(message?.updatedAt)}</Text>
              </Flex>
            ) : (
              <Box
               maxW={'60%'}
               h='auto'
               p='2px 5px'
              
               borderRadius={'2xl'}
               mr='auto'
              mb={1}
              bgColor={"#B9F5D0"}
               
              >
                {
                  message.chat.isGroupChat ? (
                    <>
                      
                       <Text textTransform={'lowercase'} fontSize={'14px'} color={'black'}>{message.sender.name}</Text>
                       <Flex   gap={2}  borderRadius={'2xl'}>
                       <Text>{message.content}</Text>
                        <Text alignSelf={'flex-end'} fontSize={'12px'}>{convertTimestampToTime(message?.updatedAt)}</Text>
                       </Flex>
                    </>

                  ):( 
                    <Flex gap={2}  >
                   <Text  >{message.content}</Text>
                   <Text alignSelf={'flex-end'} fontSize={'12px'}>{convertTimestampToTime(message?.updatedAt)}</Text>
                    </Flex>
                   
                  )
                }
              </Box>

            )}
          </Flex>
        ))}
    </>
  );
};

export default ScrollableChat;
