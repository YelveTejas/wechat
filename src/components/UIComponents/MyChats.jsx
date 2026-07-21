import React, { useCallback, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { FaPeopleGroup } from "react-icons/fa6";
import Chatloading from "./Chatloading";
import { convertTimestampToTime, getPic, getSender } from "../../config/Chatlogic";
import GroupChatModal from "../GroupChat/GroupChatModal";
import api from "../../config/axios";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats, notification } = ChatState();

  const toast = useToast();
  const fetchChats = useCallback(async () => {
    try {
      const { data } = await api.get('chat');
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [setChats, toast]);

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, fetchChats]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      bg="white"
      w={{ base: "100%", md: "25%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      overflow="hidden"
    >
      <Flex
        p={"12px 16px"}
        fontSize={"18px"}
        fontWeight="600"
        bg="white"
        color="gray.800"
        borderBottom="1px solid"
        borderColor="gray.100"
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        Chats
        <Tooltip label="New Group Chat" hasArrow placement="bottom">
          <GroupChatModal>
            <IconButton
              aria-label="New group chat"
              icon={<FaPeopleGroup size="18px" />}
              size="sm"
              variant="ghost"
              color="whatsapp.700"
              _hover={{ bg: "gray.100" }}
            />
          </GroupChatModal>
        </Tooltip>
      </Flex>
      <Flex
        flexDir={"column"}
        bg="white"
        w="100%"
        h="100%"
        overflowY={"auto"}
      >
        {chats ? (
          <Stack overflowY={"hidden"} gap={0}>
            {chats.map((chat) => {
              const chatName = !chat.isGroupChat
                ? chat.users && chat.users.length === 2 && chat.users[0]
                  ? chat.users[0]._id === loggedUser?._id
                    ? chat.users[1].name
                    : chat.users[0].name
                  : "Invalid User Data"
                : chat.ChatName;
              const isSelected = selectedChat === chat;
              const unreadCount = notification.filter(
                (n) => n.chat._id === chat._id
              ).length;
              const lastMessagePreview = chat.latestMessage
                ? `${chat.latestMessage.sender?._id === user._id ? "You: " : ""}${chat.latestMessage.content}`
                : "No messages yet";

              return (
                <Flex
                  alignItems={"center"}
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  gap={3}
                  borderBottom={"1px solid"}
                  borderColor="gray.100"
                  bg={isSelected ? "gray.100" : "white"}
                  _hover={{ bg: isSelected ? "gray.100" : "gray.50" }}
                  px={3}
                  py={3}
                  key={chat._id}
                >
                  <Avatar name={getSender(user, chat.users)} size="md" src={getPic(user,chat.users)}  />
                  <Box flex="1" minW={0}>
                    <Flex justifyContent="space-between" alignItems="baseline">
                      <Text textTransform={"capitalize"} fontWeight="600" noOfLines={1} color="gray.800">
                        {chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text fontSize="xs" color="gray.500" flexShrink={0} ml={2}>
                          {convertTimestampToTime(chat.latestMessage.updatedAt)}
                        </Text>
                      )}
                    </Flex>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
                        {lastMessagePreview}
                      </Text>
                      {unreadCount > 0 && (
                        <Badge
                          borderRadius="full"
                          bg="whatsapp.400"
                          color="white"
                          px={2}
                          ml={2}
                          flexShrink={0}
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
        ) : (
          <Chatloading></Chatloading>
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
