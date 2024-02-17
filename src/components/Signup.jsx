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
import axios from 'axios'

const signupData = {
  name: "",
  email: "",
  password: "",
  confirmpassword: "",
  pic:""
};
const Signup = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [signupdata, setSignupdata] = useState(signupData);
  const [pic, setPic] = useState();
 
  const handleClick = () => {
    setShow((pre) => !pre);
  };
  const getdata=(e)=>{
    setSignupdata({...signupdata,[e.target.name]:e.target.value})

  }



  const postDetail = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please Select an Image",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
            setPic(res.url.toString())
            setSignupdata.pic = pic
            setLoading(false)
        }).catch((err)=>{
            console.log(err,'error')
            setLoading(false)
        })
    }else{
        toast({
            title: "Please Select an Image",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false)
          return
    }
  };

  const submitHandler = async() => {
    
    setLoading(true)
    if(!signupdata.name || !signupdata.email || !signupdata.password || !signupdata.confirmpassword){
      toast({
        title: "Please Provide All the Details",
        position:'top',
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false)
      return
    }
    if(signupdata.password !== signupdata.confirmpassword){
      setLoading(false)
      toast({
        title: "Password does not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      return 
    }
    try{
       const config = {
        headers :{
          "Content-type":"application/json",
        },
       }
        console.log(signupdata,'signup')
       const {data} = await axios.post("http://localhost:4500/user/",signupdata,config)
       toast({
        title: "Registration Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data))
      setLoading(false)
     
    }catch(error){
      console.log(error)
      toast({
        title: "Error Occured!",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }  
  };
  return (
    <VStack spacing={"5PX"}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input color={'white'} name="name" placeholder="Enter you name" onChange={(e)=>getdata(e)}></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input color={'white'} name="email" placeholder="Enter youe email" onChange={(e)=>getdata(e)}></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            color='white'
            name="password"
            onChange={(e)=>getdata(e)}
            type={show ? "text" : "password"}
            placeholder="Enter you name"
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
          color='white'
          onChange={(e)=>getdata(e)}
            name="confirmpassword"
            type={show ? "text" : "password"}
            placeholder="Enter you name"
          ></Input>
          <InputRightElement width={"4.5rem"}>
            <Button h="1.7rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          onChange={(e) => postDetail(e.target.files[0])}
          p={1.5}
          accept="image/*"
        ></Input>
      </FormControl>
      <Button color="blue" width="100%" mt={15} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
