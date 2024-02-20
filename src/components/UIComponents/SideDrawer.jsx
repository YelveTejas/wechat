import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import Chatloading from "./Chatloading";
import Userslist from "./Userslist";
import { backendurl, url } from "../../pages/Home";
import { config } from "../../config/token";
//import {NotificationBadge} from 'react-no'
import { getSender } from "../../config/Chatlogic";

const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const { setUser } = ChatState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatloading, setChatloading] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
 console.log(notification,'notification')
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser();
    setSelectedChat("");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something to Search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    try {
      setLoading(true);
      config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4500/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occred",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setChatloading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${backendurl}chat`,
        { userId },
        config
      );
      if (!chats.find((e) => e._id === data._id)) setChats([data, ...chats]); //this is to find out that if your user already have chat connection.
      setChatloading(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      setChatloading(false);
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
  return (
    <>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="#38B2AC"
        w="100%"
        p="5px 30px"
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <FaSearch color="white" />
            <Text display={{ base: "none", md: "flex" }} px="4" color="white">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={"22px"}
          fontWeight={"600"}
          color={"white"}
          fontFamily={"sans-serif"}
        >
          Chit-Chat
        </Text>
        <Flex alignItems={"center"} gap={3}>
          <Menu>
            <MenuButton p={1}>
              <Box> 
              <FaBell fontSize={"2xl"} margin={1} size="20px" color="white" />
              {
                notification.length>0 && (
                  <Badge
                  position="absolute"
                  top='-1px'
                  colorScheme="red"
                  borderRadius="full"
                >
                  {notification.length}
                </Badge>
                )
              }

              </Box>
            
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((e) => (
                <MenuItem
                  key={e._id}
                  onClick={() => {
                    setSelectedChat(e.chat);
                    setNotification(notification.filter((n) => n !== e));
                  }}
                >
                  {e.chat.isGroupChat
                    ? `New message in ${e.chat.ChatName}`
                    : `New Message from ${getSender(user, e.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Search Users</DrawerHeader>
            <DrawerBody>
              <Flex pb={2}>
                <Input
                  placeholder="'Search User by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></Input>
                <Button onClick={handleSearch}>Go</Button>
              </Flex>
              {loading ? (
                <Chatloading></Chatloading>
              ) : (
                searchResults.map((user) => (
                  <Userslist
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  ></Userslist>
                ))
              )}
              {chatloading && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideDrawer;
