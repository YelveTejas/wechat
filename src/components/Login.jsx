import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { backendurl } from "../pages/Home";
import { config } from "../config/token";
const Login = () => {
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const handleClick = () => {
    setShow((pre) => !pre);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Provide All the Details",
        position: "top-right",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendurl}user/login`,
        { email, password },
        config
      );
      setLoading(false);
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (error) {
      // console.log(error);
   //   console.error(error);
    //  console.error("Response data:", error.response.data);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5PX"}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.7rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        color="blue"
        width="100%"
        mt={15}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
