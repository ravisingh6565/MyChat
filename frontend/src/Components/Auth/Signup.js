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

function Signup() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setconfirmPassword] = useState('')
    const [pic, setPic] = useState('')
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const navigate = useNavigate();



    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: 'Please select an image.',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return ;
        }

        // if(pic.type === "image/jpeg" || pic.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chatApp");
            data.append("cloud_name", "shubh1234");
            fetch("https://api.cloudinary.com/v1_1/shubh1234/image/upload", {
              method: "post",
              body: data,
            })
              .then((res) => res.json())
              .then((data) => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
              })
              .catch((err) => {
                console.log(err)
                setLoading(false);
              });
        // }else{
        //     toast({
        //         title: 'Please select an image.',
        //         // description: "We've created your account for you.",
        //         status: 'warning',
        //         duration: 5000,
        //         isClosable: true,
        //     })
        //     setLoading(false);
        //     return;
        // }
    }
    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
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

        if(password != confirmpassword){
            toast({
                title: 'Password not match',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return;
        }

        try{
            const config = {
                header : {
                    "Content-type" : "application.json",
                }
            }
            const {data} = await axios.post("/api/users" , {name ,email , password , pic },
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
            navigate('/');
            // window.location.href = '/';
        }catch (error){
            toast({
                title: 'Something went wrong',
                description: error.response.data.mesage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);

        }

    }

    return (
        <VStack spacing={"5px"} color={'black'}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your Name'
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                ></Input>
            </FormControl>


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


            <FormControl id='confirmpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Confirm Password'
                        type={show ? 'text' : 'password'}
                        value={confirmpassword}
                        onChange={(e) => { setconfirmPassword(e.target.value) }}
                    ></Input>

                    <InputRightElement width={"4.5rem"} onClick={handleClick}>
                        <Button h="1.74rem" size="sm">
                            {show ? "Hide" : "Show" }   
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <FormControl id='pic' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type='file'
                    p = {1.5}
                    accept='image/*'
                    onChange={(e) => { postDetails(e.target.files[0]) }}
                ></Input>
            </FormControl>


            <Button
                colorScheme='blue'
                w={"100%"}
                marginTop={"15px"}
                onClick={submitHandler}
                isLoading = {loading}
            >Sign Up</Button>




        </VStack>
    )
}

export default Signup