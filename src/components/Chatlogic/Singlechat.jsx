import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Avatar,
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import api, { backendurl } from "../../config/axios";
import bgImage from "../../assets/Default WhatsApp background for people who lost it_ Requested by u_Marvin_der_kuhle_.jpg"
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
import io from "socket.io-client";
import { fullSender, getPic, getSender } from "../../config/Chatlogic";
import ProfileModal from "../UIComponents/ProfileModal";
import UpdateGroupChatModal from "../GroupChat/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
const ENDPOINT = backendurl;
var socket, selectedChatCompare;

const Singlechat = ({ fetchAgain, setFetchAgain }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [newMessage, setnewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [allMessage, setallMessage] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState("");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const sendMessage = async (e) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      setnewMessage(e.target.value); ///typing indicator message
      try {
        setnewMessage("");
        const { data } = await api.post("message", {
          content: newMessage,
          chatId: selectedChat._id,
        });
        socket.emit("new message", data);
        setallMessage([...allMessage, data]);
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
    }
  };

  const fetchAllMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`message/${selectedChat._id}`);
      setallMessage(data);
      socket.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occred",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // this to check whether chat is selected or not and second condition is to check message receive from the socket belongs to the same chat that we have open now
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setallMessage([...allMessage, newMessageReceived]);
      }
    });
  });
  const typingHandler = (e) => {
    setnewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Flex
            p={3}
            w="100%"
            alignItems={"center"}
            bg="white"
            color="gray.800"
            borderBottom="1px solid"
            borderColor="gray.100"
            borderTopRadius={"lg"}
          >
            <Box color="whatsapp.700">
            <IoMdArrowBack
              size="20px"
              cursor={"pointer"}
              onClick={() => setSelectedChat("")}
            />
            </Box>
            <Flex w='full'px='10px' alignItems={'center'} justifyContent={'space-between'}>
            {!selectedChat?.isGroupChat ? (
              <>
              <Flex alignItems={'center'} gap={3}>
                <Avatar name={getSender(user,selectedChat.users)} size='sm' src={getPic(user,selectedChat.users)}/>
                <Text fontSize={"18px"} fontWeight={"500"}>
                  {getSender(user, selectedChat.users).toUpperCase()}
                </Text>
                </Flex>
                <ProfileModal user={fullSender(user, selectedChat?.users)} />
              </>
            ) : (
              <>
                <Text fontSize={"18px"} fontWeight={"500"}>
                  {selectedChat?.ChatName?.toUpperCase()}
                </Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchAllMessages={fetchAllMessages}
                />
              </>
            )}
            </Flex>
          </Flex>
          <Flex
            flexDirection={"column"}
            justifyContent={"flex-end"}
            bg="#E5DDD5"
            bgImage={bgImage}
            w="100%"
            h={{base:"85%",md:"100%"}}

            borderBottomRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <Flex
              flexDirection="column"
              overflowY="scroll"
              
              className="no-scroll" // Apply 'no-scroll' class to disable default Chakra UI scrollbar styling
              css={{
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888', // Color of the scrollbar thumb
                  borderRadius: '3px', // Rounded corners of the thumb
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f1f1', // Color of the scrollbar track
                },
              }} 
              >
                <ScrollableChat messages={allMessage} />
              </Flex>
            )}
            <FormControl isRequired>
              {isTyping ? (
                <Box>
                  <Lottie
                    options={defaultOptions}
                    width={50}
                    style={{ marginBottom: 10, marginLeft: 10 }}
                  />
                </Box>
              ) : (
                <></>
              )}
              <Flex alignItems={'center'} mx='10px' gap='10px' mb={2} mt={1}>
              <Input
                variant={"filled"}
                bg="white"
                borderRadius="full"
                _hover={{ bg: "white" }}
                _focus={{ bg: "white" }}
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessage}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
              ></Input>
              <IconButton
                aria-label="Send message"
                icon={<IoMdSend size='18px'/>}
                onClick={sendMessage}
                isRound
                bg="whatsapp.400"
                color="white"
                _hover={{ bg: "whatsapp.500" }}
              />
              </Flex>
             
            </FormControl>
          </Flex>
        </>
      ) : (
        <Flex alignItems={"center"} justifyContent={"center"} h="100%">
          <Text fontSize={"3xl"} pb={3}>
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Singlechat;
