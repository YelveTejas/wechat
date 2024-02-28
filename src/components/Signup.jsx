import React, { useState } from "react";
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
import axios from "axios";
import { backendurl } from "../pages/Home";

const signupData = {
  name: "",
  email: "",
  password: "",
  confirmpassword: ""
 
};
const Signup = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [signupdata, setSignupdata] = useState(signupData);
  const [pic, setPic] = useState('');
  const isValidEmail = (email) => {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
 // console.log(signupdata, "signupdata");
  const handleClick = () => {
    setShow((pre) => !pre);
  };
  const getdata = (e) => {
    setSignupdata({ ...signupdata, [e.target.name]: e.target.value });
  };

  const postDetail = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "wechat");
      data.append("cloud_name", "ds1miblwi");
      fetch("https://api.cloudinary.com/v1_1/ds1miblwi/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          //    console.log(res,'res')
          setPic(res.url.toString());
        
          setLoading(false);
        })
        .catch((err) => {
       //   console.log(err, "error");
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    const signupDataWithPic = {
      ...signupdata,
      pic: pic,
    };
  //  console.log(signupDataWithPic,'pic')
    setLoading(true);
    if (
      !signupDataWithPic.name ||
      !signupDataWithPic.email ||
      !signupDataWithPic.password ||
      !signupDataWithPic.confirmpassword
    ) {
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
    if (!isValidEmail(signupdata.email)) {
      toast({
        title: "Invalid Email Format",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }

    if (signupDataWithPic.password !== signupDataWithPic.confirmpassword) {
      setLoading(false);
      toast({
        title: "Password does not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }
    if (!signupDataWithPic.pic) {
      setLoading(false);
      toast({
        title: "Please Upload Picture",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
    //  console.log(signupDataWithPic, "signup");
      const { data } = await axios.post(
        `${backendurl}user`,
        signupDataWithPic,
        config
      );
      toast({
        title: "Registration Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      //console.log(error);
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5PX"}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          
          name="name"
          placeholder="Enter your name"
          onChange={(e) => getdata(e)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          
          name="email"
          placeholder="Enter your email"
          onChange={(e) => getdata(e)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            
            name="password"
            onChange={(e) => getdata(e)}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.7rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel> Confirm Password</FormLabel>
        <InputGroup>
          <Input
            
            onChange={(e) => getdata(e)}
            name="confirmpassword"
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.7rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl  isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          onChange={(e) => postDetail(e.target.files[0])}
          p={1.5}
          accept="image/*"
        ></Input>
      </FormControl>
      <Button
        color="blue"
        width="100%"
        mt={15}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
