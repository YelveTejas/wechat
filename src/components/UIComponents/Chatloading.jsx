import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const Chatloading = () => {
  return (
    <Stack>
        <Skeleton h='40px'/>
        <Skeleton h='40px'/>
        <Skeleton h='40px'/>
        <Skeleton h='40px'/>
        <Skeleton h='40px'/>
        <Skeleton h='40px'/>
        
    </Stack>
  )
}

export default Chatloading