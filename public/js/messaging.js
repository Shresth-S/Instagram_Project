const socket = io();

const EnterChatbtn = document.querySelector('.EnterChatbtn');
const username = document.querySelector('.username');
const userdetails = document.querySelector('.userdetails');
const chatbox = document.querySelector('.chatbox');
const msg = document.querySelector('#msg');
const sendbtn = document.querySelector('.sendbtn');
const msgList = document.querySelector('.msgList');

chatbox.classList.add("hide");

EnterChatbtn.addEventListener('click', () => {
    socket.emit("signup", {
        username: username.value,
        id: socket.id
    });
    console.log(socket);

    userdetails.classList.add("hide");
    chatbox.classList.add("show");
})

sendbtn.addEventListener('click', (ev) => {
    console.log("your input- ", msg.value);
    socket.emit("Sendmsg", {
        msg:msg.value,
        senderid: socket.id
    });
    msg.value='';
})

socket.on("reply", (msg) => {
    console.log(msg);
    console.log(msg.msg);
    // console.log(msg.sender);
    console.log(socket.id);
    let div = document.createElement('div');
    div.innerText = `${msg.sender} : ${msg.msg}`;
    msgList.appendChild(div);
    // io.to(WR3IK754zD9cTL - uAAAD).emit("prsnlmsg", "hello Priyansh");
    // io.to(socketId).emit(/* ... */);

})

socket.on("prsnlmsg", (msg) => {
    console.log(msg);
})


socket.on("hello", (msg) => {
    console.log(msg);
    socket.emit("received", ("client: hn mai bhi gya"));
})

socket.on("users", (users) => { // getting all online users
    users.forEach((user) => {
        user.self = user.userID === socket.id;
        // initReactiveProperties(user);
    });
    console.log(users);
    // put the current user first, and then sort by username
    this.users = users.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
    });
    console.log(users);
});
  
  