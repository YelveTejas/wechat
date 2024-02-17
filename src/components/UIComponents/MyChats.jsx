import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { backendurl } from "../../pages/Home";
import { FaPeopleGroup } from "react-icons/fa6";
import Chatloading from "./Chatloading";
import { getSender } from "../../config/Chatlogic";
import GroupChatModal from "../GroupChat/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${backendurl}chat`, config);
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
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  // console.log(loggedUser,'loggeduser')
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={2}
      bg="white"
      w={{ base: "100%", md: "25%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        p={"3px 3px"}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"sans-serif"}
        display={"flex"}
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <FaPeopleGroup color="blue" size="20px" cursor={"pointer"} />
        </GroupChatModal>
      </Box>
      <Flex
        flexDir={"column"}
        p={1}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"hidden"} gap={0}>
            {chats.map((chat) => (
              <Flex
                alignItems={"center"}
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                gap={3}
                borderBottom={"1px solid #38B2AC"}
                bg={selectedChat === chat ? "#38B2AC" : "#ffffff"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                key={chat._id}
              >
                <Avatar name={getSender(user, chat.users)} size="sm" />
                <Text textTransform={"capitalize"}>
                  {!chat.isGroupChat
                    ? chat.users && chat.users.length === 2 && chat.users[0]
                      ? chat.users[0]._id === loggedUser?._id
                        ? chat.users[1].name
                        : chat.users[0].name
                      : "Invalid User Data"
                    : chat.ChatName}
                </Text>
              </Flex>
            ))}
          </Stack>
        ) : (
          <Chatloading></Chatloading>
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
