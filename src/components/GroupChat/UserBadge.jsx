import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { RxCross2 } from "react-icons/rx";

const UserBadge = ({user,handleFunction}) => {
  return (
    <Flex px={2}  gap={1} alignItems={'center'} py={1} borderRadius={'lg'} bgColor='cyan'mx="3px" mb={1} cursor={'pointer'} onClick={handleFunction}> 
       <Text textTransform={'capitalize'}>{user.name}</Text>
       <RxCross2 size='16px'/>
    </Flex>
  )
}

export default UserBadge