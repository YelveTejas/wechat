import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { ChatState } from "../../Context/ChatProvider";
import { convertTimestampToTime } from "../../config/Chatlogic";

const bubbleShadow = "0 1px 0.5px rgba(0,0,0,0.13)";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <>
      {messages &&
        messages.map((message) => {
          const isOwn = message.sender._id === user._id;
          return (
            <Flex key={message._id} mb={"3px"} px={3}>
              <Box
                ml={isOwn ? "auto" : undefined}
                mr={isOwn ? undefined : "auto"}
                maxW={"65%"}
                p="6px 9px"
                bg={isOwn ? "whatsapp.100" : "white"}
                boxShadow={bubbleShadow}
                borderRadius="lg"
                borderTopRightRadius={isOwn ? "sm" : "lg"}
                borderTopLeftRadius={isOwn ? "lg" : "sm"}
              >
                {message.chat.isGroupChat && !isOwn && (
                  <Text
                    textTransform={"lowercase"}
                    fontSize={"13px"}
                    fontWeight="600"
                    color={"whatsapp.700"}
                  >
                    {message.sender.name}
                  </Text>
                )}
                <Flex gap={2} alignItems="flex-end">
                  <Text textAlign={"justify"} fontSize="sm">
                    {message.content}
                  </Text>
                  <Text
                    alignSelf={"flex-end"}
                    fontSize={"11px"}
                    color="gray.500"
                    flexShrink={0}
                    ml="auto"
                  >
                    {convertTimestampToTime(message?.updatedAt)}
                  </Text>
                </Flex>
              </Box>
            </Flex>
          );
        })}
    </>
  );
};

export default ScrollableChat;
