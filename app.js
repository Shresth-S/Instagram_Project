const path = require('path');
const express = require('express');
const app = express();
const PORT = 4444;
const hbs = require('hbs');
const mongoose = require('mongoose'); 
const Router = require('./routes/routes');
const session = require('express-session');
const passport = require('./auth/passport');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const userMap = {};

// io.on("connection", (socket) => {

//     const users = [];
//     for (let [id, socket] of io.of("/").sockets) { // sending all online users
//       users.push({
//         userID: id,
//         username: socket.username,
//       });
//     }
//     socket.emit("users", users);

//     socket.emit("hello", "mai server hu mai chal gya!!!!");

//     socket.on("Sendmsg", (msg) => {
//         console.log(msg.msg);
//         io.emit("reply", {
//             msg: msg.msg,
//             sender:userMap[msg.senderid]
//         })
//     })

//     socket.on("received", (msg) => {
//         console.log(msg);
//     })

//     socket.on("signup", (msg) => {
//         console.log("userMap",userMap);
//         // console.log(msg);
//         console.log(socket.id);
//         userMap[msg.username] = socket.id
//         userMap[socket.id] = msg.username
//         console.log(userMap[socket.id]);
//         console.log(msg.username);
//         socket.emit("signupSuccess", "signupSuccess");
//     })
// });

let MongoDBStore = require('connect-mongodb-session')(session);

let store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/instadb',
    collection: 'mySessions'
});

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'fkgvcjhkxdefghb',
    resave: false,
    saveUninitialized: true,
    store: store
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', Router);

app.get('/', (req, res) => {
    console.log("req.user: ",req.user);
    res.render('login');
});

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});




mongoose.connect('mongodb://127.0.0.1:27017/instadb')
        .then(()=>{
            server.listen(PORT,()=>{
                console.log(`http://localhost:`+PORT);
            })
        })
        .catch(err => {
            console.log(err);
        })



