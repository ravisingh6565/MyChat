import React, { useEffect , useState } from 'react'
import {
  Container,
  Box,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react'


import Login from '../Components/Auth/Login'
import Signup from '../Components/Auth/Signup'
import { useNavigate } from 'react-router-dom';
function Home() {


  const history = useNavigate();
  // const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    // setUser(userInfo);

    if (userInfo){
        history('/chats')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);



  return (
    <Container maxW='xl' centerContent >
      <Box
        display='flex'
        justifyContent="center"
        p={3}
        bg={'white'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize='4xl' fontFamily="Work sans" color='black'>Shubh-Talks</Text>
      </Box>


      <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"}
        borderWidth={"1px"} color={'balck'}>

        <Tabs variant='soft-rounded' >
          <TabList mb = "1em">
            <Tab w={"50%"}>LogIn</Tab>
            <Tab w={"50%"}>SignUp</Tab>
          </TabList>


          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home