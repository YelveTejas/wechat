import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { ChatState } from "../../Context/ChatProvider";
import UserBadge from "./UserBadge";
import api from "../../config/axios";
import Userslist from "../UIComponents/Userslist";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
  const [renameGroupChat, setRenameGroupChat] = useState("");
  const [searchUsers, setSearchUsers] = useState();
  const toast = useToast();

  const [renameLoading, setRenameLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
  const handleRename = async () => {
    if (!renameGroupChat) {
      return;
    }

    try {
      setRenameLoading(true);
      const { data } = await api.put("chat/rename", {
        chatId: selectedChat._id,
        ChatName: renameGroupChat,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setRenameLoading(false);
    }

    setRenameGroupChat("");
  };
  const handleRemove = async (usertoRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      usertoRemove._id !== user._id
    ) {
      toast({
        title: "only admins can remove members from group",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }
    try {
    
      const { data } = await api.put("chat/remove", {
        chatId: selectedChat._id,
        userId: usertoRemove._id,
      });

      usertoRemove._id === user._id ? setSelectedChat("") : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages()
     
    } catch (error) {
      toast({
        title: "error while removing from group",
        status: "info",
        duration: 300,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleSearch = async (query) => {
    setSearchUsers(query);
    if (!query) {
      return 0;
    }
    try {
     
      const { data } = await api.get(`user?search=${searchUsers}`);
      
      setSearchResults(data);
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

  const addMemberstoGroup = async (userToAdd) => {
    if (selectedChat.users.find((e) => e._id === userToAdd._id)) {
      toast({
        title: "User Already added in the group",

        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      // user is the logged in user
      toast({
        title: "Only Admin can add users to group",

        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
     
      const { data } = await api.put("chat/add", {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
     
    } catch (error) {
      toast({
        title: "Error while adding member to group",
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
      <IconButton icon={<FaEdit />} onClick={onOpen}>
        Open Modal
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"35px"} textAlign={"center"}>
            {selectedChat.ChatName}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text color={"black"} textAlign={"end"}>
              {" "}
              Admin: {selectedChat?.groupAdmin?.name}
            </Text>
            <Flex flexWrap={"wrap"} pb={3} mt={2}>
              {selectedChat?.users
                .filter((user1) => user1._id !== user._id)
                .map((e) => (
                  <UserBadge
                    key={e._id}
                    user={e}
                    handleFunction={() => handleRemove(e)}
                  />
                ))}
            </Flex>
            <FormControl>
              <Flex alignItems={"center"} mb={3}>
                <Input
                  placeholder="Group Name"
                  value={renameGroupChat}
                  onChange={(e) => setRenameGroupChat(e.target.value)}
                />
                <Button
                  variant={"outline"}
                  colorScheme="teal"
                  size={"sm"}
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </Flex>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add New Users to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {searchResults?.slice(0, 4).map((e) => (
              <Userslist
                key={e._id}
                user={e}
                handleFunction={() => addMemberstoGroup(e)}
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              size={"sm"}
              onClick={() => handleRemove(user)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
