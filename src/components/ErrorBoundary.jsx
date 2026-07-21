import React from "react"
import { Button, Heading, Text, VStack } from "@chakra-ui/react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <VStack justifyContent="center" h="100vh" spacing={4}>
          <Heading size="md">Something went wrong.</Heading>
          <Text>Please refresh the page and try again.</Text>
          <Button onClick={() => window.location.assign("/")}>Go to Home</Button>
        </VStack>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
