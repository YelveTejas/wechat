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
export { backendurl } from "../config/axios";
const Home = () => {
  return (
    <Box minH={'100vh'} bg="gray.100">
    <Container maxW={"xl"} centerContent>
      <Box
        d="flex"
        w="100%"
        justifyContent={"center"}
        p={"5"}
        m="40px 0 15px 0"
        borderRadius={"lg"}
        bg="whatsapp.700"
      >
        <Text
          fontSize={"4xl"}
          fontWeight={"lg"}
          color={"white"}
          textAlign={"center"}

        >
          WECHAT
        </Text>
      </Box>
      <Box w="100%" p={'10px'} borderRadius={"lg"} bg="white" boxShadow="md">
        <Tabs variant="soft-rounded" colorScheme="whatsapp">
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
