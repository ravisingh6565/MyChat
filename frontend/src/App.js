import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Button, ButtonGroup } from '@chakra-ui/react'
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      {/* <Button colorScheme='blue'>Button</Button> */}
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
