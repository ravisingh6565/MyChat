import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  flexbox,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner
} from "@chakra-ui/react";

import ChatLoading from "./ChatLoading";

import UserListItem from "../userAvatar/UserListItem";


import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

import { ChatState } from "../../Context/ChatProvider";
// import { ChatState } from "../Context/ChatProvider";


import axios from 'axios'

import { useNavigate } from "react-router-dom";

import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogics";

const SideDraw = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const toast = useToast()

  const history = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { DisOpen, DonOpen, DonClose } = useDisclosure()
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const { user , setSelectedChat , chats , setChats, notification,
    setNotification } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    history("/");
  };

  const chk = () => {
    console.log(searchResult)
  }




  const handleSearch = async() => {
    if(!search){
        toast({
            title: 'Please enter a name or email.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-left',
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.get(`/api/users?search=${search}`, config);
        setLoading(false);
        setSearchResult(data);  // Corrected here to data.data
    } catch (error) {
        toast({
            title: 'Error Occurred.',
            description: "Failed to retrieve Data",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-left',
        });
    }
};


const accessChat = async (userId) => {
  console.log(userId);

  try {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`/api/chat`, {userId}, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};




  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignContent={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button onClick={onDrawerOpen} variant={"ghost"}>
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} /> */}
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontFamily="Work sans" fontSize={"2xl"}>
          Shubh-Talks
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>

            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>


          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>

            <MenuList>
              {/* <ProfileModal>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal> */}
              <MenuItem onClick={onOpen}>My Profile</MenuItem>
              <MenuItem
                onClick={() => {
                  logoutHandler();
                }}
              >
                Logout
              </MenuItem>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent display={"flex"}>
                  <ModalHeader
                    fontFamily={"Work sans"}
                    display={"flex"}
                    fontSize={"40px"}
                    justifyContent={"center"}
                  >
                    {user.name}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                    display={"flex"}
                    flexDir={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    {/* <img height={"20px"} style={{borderRadius : "full", boxSizing : "150px"}} src={user.pic} alt="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" /> */}

                    {/* <img
                                            height="150px"
                                            width="150px"
                                            style={{
                                                borderRadius: "50%",
                                                border: "5px solid #ff69b4" // Example border color (hot pink)
                                            }}
                                            src={user.pic}
                                            alt="User Avatar"
                                            onError={(e) => e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                        /> */}

                    <div
                      style={{
                        position: "relative",
                        height: "160px",
                        width: "160px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "conic-gradient(red, orange, yellow, green, blue, indigo, violet)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          height: "150px",
                          width: "150px",
                          borderRadius: "50%",
                          backgroundColor: "white",
                        }}
                      ></div>
                      <img
                        height="150px"
                        width="150px"
                        style={{
                          borderRadius: "50%",
                          border: "5px solid transparent",
                          position: "relative",
                          zIndex: 1,
                        }}
                        src={user.pic}
                        alt="User Avatar"
                        onError={(e) =>
                          (e.target.src =
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
                        }
                      />
                    </div>

                    <Text
                      fontFamily={"work sans"}
                      fontSize={{ base: "28px", md: "30px" }}
                    >
                      Email : {user.email}
                    </Text>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    {/* <Button variant="ghost">Secondary Action</Button> */}
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>

            <DrawerBody>
            <Box display={"flex"} pb={"2"}> 
                <Input 
                placeholder="Search by name or email"
                mr={2}
                value = {search}
                onChange={(e) => setSearch(e.target.value)}>
               
                </Input>        
                <Button onClick={() => {handleSearch()}}>Go</Button>
                {/* <Button onClick={() => {chk()}}>chk</Button> */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              Array.isArray(searchResult) && searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

             {loadingChat && <Spinner ml="auto" d="flex" />}
           </DrawerBody>
          </DrawerContent>

          

        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default SideDraw;
