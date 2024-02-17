import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
 // console.log(messages)
  return (
    <>
      {messages &&
        messages.map((message, index) => (
         
          <Flex key={message._id} mb={'3px'} px={3}>
      
            {message.sender._id === user._id ? (
              <Box ml="auto" bgColor={"#B9F5D0"} p='5px 10px' maxW={'60%'} borderRadius={'base'}>
                <Text>{message.content}</Text>
              </Box>
            ) : (
              <Box mr="auto" bgColor={"#B9F5D0"} p='5px 10px' maxW={'60%'} borderRadius={'base'}>
                <Text>{message.content}</Text>
              </Box>
            )}
          </Flex>
        ))}
    </>
  );
};

export default ScrollableChat;
