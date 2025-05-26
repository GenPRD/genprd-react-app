import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const AuthCard = ({ children }) => (
  <MotionBox
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    maxW="md"
    w="full"
    mx="auto"
    p={{ base: 6, md: 10 }}
    bg="whiteAlpha.700"
    borderRadius="2xl"
    boxShadow="2xl"
    borderWidth="1.5px"
    borderColor="whiteAlpha.400"
    backdropFilter="auto"
    backdropBlur="lg"
    backdropSaturate={150}
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
    {children}
  </MotionBox>
)

export default AuthCard 