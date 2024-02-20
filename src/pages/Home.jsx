import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
 export const backendurl = 'http://localhost:4500/'
const Home = () => {

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
  })
  return (
    <Box minH={'100vh'}>
    <Container maxW={"xl"} centerContent boxShadow={"md"}>
      <Box
        d="flex"
      
        w="100%"
        justifyContent={"center"}
        p={"3"}
        m="40px 0 15px 0"
        borderRadius={"lg"}
        bgGradient="linear(to-t, #FF00A5, #8000FF)"
      >
        <Text
          fontSize={"4xl"}
          fontWeight={"lg"}
          color={"white"}
          textAlign={"center"}
        
        >
          Chit - Chat
        </Text>
      </Box>
      <Box  w="100%" p={'10px'}  borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
    </Box>
  );
};

export default Home;
