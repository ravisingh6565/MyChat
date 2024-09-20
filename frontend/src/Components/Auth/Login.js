import { 
    Button,
    FormControl, 
    FormLabel, 
    Input, 
    InputGroup, 
    InputRightElement, 
    VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

import { useToast } from '@chakra-ui/react'

import axios from 'axios'

import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const navigate = useNavigate();


    const handleClick = () => {
        setShow(!show);
    }
    const submitHandler = async() => {
        setLoading(true);
        if( !email || !password ){
            toast({
                title: 'Please fill all the fields.',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        

        try{
            const config = {
                header : {
                    "Content-Type" : "application.json",
                }
            }
            const { data } = await axios.post(
                "/api/users/login",
                { email, password },
                config
              );
            toast({
                title: 'Registration Successfull',
                // description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
            // window.location.href = '/';
        }catch (error){
            toast({
                title: 'Something went wrong',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);

        }

    }



  return (
    
    <VStack spacing={"5px"} color={'black'}>
            


            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your Email'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                ></Input>
            </FormControl>


            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your Password'
                        type={show ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    ></Input>

                    <InputRightElement width={"4.5rem"} onClick={handleClick}>
                        <Button h="1.74rem" size="sm">
                            {show ? "Hide" : "Show" }   
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


           

           

            <Button
                colorScheme='blue'
                w={"100%"}
                marginTop={"15px"}
                onClick={submitHandler}
                isLoading={loading}
            >LogIn</Button>


            <Button
                variant={"solid"}
                colorScheme='red'
                w={'100%'}
                onClick={ () => {
                    setEmail("guest@example.com");
                    setPassword("12345678");
                }}
            >Get Guest User Credentials</Button>
        </VStack>
  )
}

export default Login