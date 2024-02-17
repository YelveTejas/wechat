import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
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
import axios from "axios";
import { backendurl } from "../../pages/Home";
import Userslist from "../UIComponents/Userslist";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
  const [renameGroupChat, setRenameGroupChat] = useState("");
  const [searchUsers, setSearchUsers] = useState();
  const toast = useToast();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();
 // console.log(selectedChat, "selectedCHAT");
  const handleRename = async () => {
    if (!renameGroupChat) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${backendurl}chat/rename`,
        {
          chatId: selectedChat._id,
          ChatName: renameGroupChat,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
     // console.log(error, "error");
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
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${backendurl}chat/remove`,
        {
          chatId: selectedChat._id,
          userId: usertoRemove._id,
        },
        config
      );

      usertoRemove._id === user._id ? selectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages()
      setLoading(false);
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
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${backendurl}user?search=${searchUsers}`,
        config
      );
      //    console.log(data,'iusers')
      setLoading(false);
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
   // console.log(userToAdd);
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
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${backendurl}chat/add`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
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
