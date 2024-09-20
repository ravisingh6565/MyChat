const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const ConnectDb = require('./config/DB');

const auth = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require("./routes/messageRoutes");

const {notFound , errorHandler} = require('./middleware/errorMiddleware');

const app = express();


app.use(express.json());  // parse json request bodies to javascript objects

app.use(cors())

dotenv.config();
ConnectDb();

const PORT = process.env.port || 5000;

const {data} = require('./data');

// app.use(require('./routes/auth'))




app.use('/api/users' , auth)
app.use('/api/chat' , chatRoutes)
app.use("/api/message", messageRoutes);



app.use(notFound)
app.use(errorHandler)








const server = app.listen(PORT , ()=> {
    console.log(`Server is running on ${PORT}`);
});

// --------------------------------Socket Started----------------------------------
const io = require('socket.io')(server , {
    pingTimeout : 60000,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


io.on("connection" , (socket) => {
    console.log("socket connected");

    socket.on('setUp' , (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    })


    socket.on('join chat' , (room) => {
        socket.join(room);
        console.log('user joined Room : ' + room);
    })

    socket.on('typing' , (room) => {
        socket.in(room).emit("typing");
    })
    socket.on('stop typing' , (room) => {
        socket.in(room).emit("stop typing");
    })

    socket.on('new Message' , (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return console.log('caht.users not defined');
        }
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return ;
            socket.in(user._id).emit("message received" , newMessageRecieved)
        })
    })


    socket.off("setUp" , () => {
        console.log("socket disconnected");
        socket.leave(userData._id)
    })
})