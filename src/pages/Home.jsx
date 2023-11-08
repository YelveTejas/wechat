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
import React from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Home = () => {
  return (
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
          Connet With Your Loved Ones
        </Text>
      </Box>
      <Box w="100%" p={{base:"10px",md:"4"}} borderRadius={"lg"} borderWidth={"1px"}>
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
  );
};

export default Home;
