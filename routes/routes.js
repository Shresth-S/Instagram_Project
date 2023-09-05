const path = require('path');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Posts = require('../models/posts');
const methodOverride = require('method-override');
const comments = require('../models/comments');

router.get('/authenticate', (req, res) => { 
    res.render('login', {
        msg: "username/password incorrect"
    });
})

router.post('/authenticate',
    passport.authenticate('local', { failureRedirect: '/api/authenticate' }),
    function (req, res) {
        res.redirect('/api/home');
    });

router.use(methodOverride('_method'));

router.get('/profile', (req, res) => {
    res.render('profile', {
        username: req.user.username
    });
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await Users.findOne({ username });
        if (user) {
            res.render('signup', {
                msg: "User already exists"
            })
        }
        else {
            bcrypt.genSalt(saltRounds, async function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    await Users.create({ username: username, password: hash })
                    res.render('login', {
                        msg: "Signup Successful,Login to continue"
                    })
                });
            });

        }
    }
    catch (err) {
        console.log(err);
    }
})

router.get('/addpost', (req, res) => {
    res.render('addpost');
})

router.get('/posts', async (req, res) => { // get request on /posts for getting a single post
    const { id } = req.query;
    let post = await Posts.findOne({ _id: id })
    console.log("id", id);
    console.log(post);
    console.log("line 70 tak chal gya");
    res.render('postInfo', {
        post
    })
})

router.post('/posts', async (req, res) => { //post request on /posts is same as post request on addpost
    const { title, description, imageurl } = req.body;
    const newPost = new Posts({
        title,
        description,
        imageurl,
        postOwner: req.user._id,
        OwnerName:req.user.username,
        likedby: [],
        comments: [],
        public:req.user.public
    })
    await Users.findOne({ _id: req.user._id })
        .then((user) => {
            user.posts.unshift(newPost._id);
            user.postCount++;
            user.save();
        })

    await newPost.save();
    console.log("Post added successfully");
    res.redirect('/api/all_posts')
})

router.get('/all_posts', (req, res) => {
    console.log("Current Loggedin User: ", req.user.username);
    console.log("Current Loggedin User id: ", req.user._id);
    Posts.find({ postOwner: req.user._id })
        .then((posts) => {
            console.log(posts);
            // console.log("7410258963....");
            res.render('myposts', {
                posts,
            });
        })
})

router.delete('/posts', async (req, res) => {
    const { id } = req.body;
    let post = await Posts.findOne({ _id: id });
    // console.log(post);
    console.log(post.postOwner);
    console.log(req.user._id);
    if (post.postOwner.equals(req.user._id)) {
        console.log("Post to be deleted: ", id);
        // res.send("chal gyi");
        let user = await Users.findOne({ _id: req.user._id });
        let posts = user.posts;
        let new_Posts = posts.filter((value) => {
            return value != id;
        })

        await Users.updateOne({ _id: req.user._id }, {
            $inc: { postCount: -1 },
            $set: {
                posts: new_Posts
            }
        })

        await Posts.findByIdAndDelete(id)
            .then(() => {
                res.redirect('/api/all_posts')
            })
    }
    else {
        res.send("You are not authorized to delete this post");
    }
})

router.post('/like', async (req, res, next) => {
    const { id } = req.body;
    console.log(id);
    console.log("MAIIIIII CHALAAAAAA");
    let userid = req.user._id;
    let post;
    try {
        post = await Posts.findOne({ _id: id });
        console.log("itni value pe click hua: ", post.likes);
    }
    catch (err) {
        console.log("line no. 153 in routes", err);
    }

    let arr = post.likedby;
    let new_arr = arr.filter((value) => {
        if (value.equals(userid)) {
            return false;
        }
        else {
            return true;
        }
    });

    try {
        if (new_arr.length == arr.length) {
            new_arr.push(userid);
            await Posts.findOneAndUpdate({ _id: id }, { $inc: { likes: 1 }, $set: { likedby: new_arr } }, { new: true });
            console.log("maine badha diya");
        }
        else {
            await Posts.findOneAndUpdate({ _id: id }, { $inc: { likes: -1 }, $set: { likedby: new_arr } }, { new: true });
            console.log("maine kam kr diya");
        }
    }
    catch (err) {
        console.log("line no. 186 in routes", err);
    }

    let post_after_update = await Posts.findOne({ _id: id });

    let likes = [];
    likes.push(post_after_update.likes); 
    res.send(likes); //we cannot send an integer in res.send so we made likes as a single-valued array
})


router.post('/addcomment', async (req, res) => {
    console.log("Yahan tak request to Aagyiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log("");
    console.log("");
    console.log("");
    const { id, comment } = req.body;
    console.log(id);
    console.log(comment);
    let post = await Posts.findOne({ _id: id });
    console.log(post.comments);
    // res.send("hello");
    let newComments = post.comments;
    newComments.push(comment);
    Posts.updateOne({ _id: id }, {
        $set: {
            comments: newComments
        }
    }).then(() => {
        res.send(newComments);
    })
})

router.get('/users', async (req, res) => {
    const { id } = req.user._id;
    let users = await Users.find({ _id: { $nin: [req.user._id] } }).limit(40);
    res.render('users', {
        users
    })
})

router.post('/follow', async (req, res) => {
    const { id } = req.body;
    const currentuserid = req.user._id;

    let curr_user = await Users.findOne({ _id: currentuserid })
    let following_arr = curr_user.following_arr;
    let newfollowing_arr = following_arr.filter((value) => {
        return value != id
    })
    if (following_arr.length != newfollowing_arr.length) {
        res.redirect('/api/users');
    }
    else {
        await Users.findOne({ _id: currentuserid })
            .then((user) => {
                user.following_arr.push(id);
                user.following++;
                user.save();
            })

        await Users.findOne({ _id: id })
            .then((user) => {
                user.followers_arr.push(currentuserid)
                user.followers++;
                user.save();
            })
        res.redirect('/api/users');
    }
})


router.post('/unfollow', async (req, res) => {
    const { id } = req.body;
    const currentuserid = req.user._id;

    let curr_user = await Users.findOne({ _id: currentuserid })
    let following_arr = curr_user.following_arr;
    let newfollowing_arr = following_arr.filter((value) => {
        return value != id
    })
    if (following_arr.length == newfollowing_arr.length) {
        res.redirect('/api/users');
    }
    else {
        let user_to_be_unfollowed = await Users.findOne({ _id: id });
        let followers_arr = user_to_be_unfollowed.followers_arr;
        let newfollowers_arr = followers_arr.filter((value) => {
            return value != currentuserid
        })

        await Users.updateOne({ _id: currentuserid }, {
            $inc: { following: -1 },
            $set: {
                following_arr: newfollowing_arr
            }
        })

        await Users.updateOne({ _id: id }, {
            $inc: { followers: -1 },
            $set: {
                followers_arr: newfollowers_arr
            }
        })
        res.redirect('/api/users');
    }

})

router.get('/user', (req, res) => {
    let user=req.user;
    res.render('profile', {
        user
    })
})

router.get('/home', async (req, res) => {
    if (req.user) {
        let following_arr = req.user.following_arr;
        let finalposts = [];

        for (let i in following_arr) {
            let userid = following_arr[i];
            let user = await Users.findOne({ _id: userid }, { posts: { $slice: -2 } }).populate('posts');
            // db.table.find({}, { array: { $slice: -1 } });
            let posts = user.posts;
            finalposts = [...posts,...finalposts];
        }

        let users = await Users.find({ _id: { $nin: [req.user._id] } }).limit(5);
        res.render('homepage', {
            allPosts: finalposts,
            users,
            themedark:req.session.themedark
        })
    }
    else {
        res.render('login', {
            msg: "Login to see what u are missing out on!!"
        })
    }
})

router.get('/explore', async (req, res) => {
    let posts;
    try {
        let limit = 9, offset = 0;
        posts = await Posts.find({ public: true }).skip(offset).limit(limit); 
    }
    catch (err) {
        console.log(err);
    }
    res.render('explore', {
        posts: posts
    })
})

router.get('/message', (req, res) => {
    console.log(req.user.username);
    console.log("Hello bhailogggggggg");
    res.render('messaging', {
        username: req.user.username,
        id:req.user._id
    });
})

router.get('/explore_posts', async (req, res) => {
    try {
        let { limit, offset } = req.query;
        offset = Number(offset);
        let posts = await Posts.find({ public: true }).skip(offset).limit(limit);
        res.send(posts);        
    }
    catch (err) {
        console.log(err);
    }
})

router.get('/helplink', (req, res) => {
    res.redirect('https://about.instagram.com/');
})

router.get('/testing', (req, res) => {
    res.render('testing');
})

router.get('/privateAccount', async (req, res) => {
    req.user.public = false;
    let userid = req.user._id;
    await Posts.updateMany({ postOwner: userid }, {
        public: false
    });
    res.render('profile', {
        user: req.user,
        msg:"You're account is private now! only the followers you approve can see what you share"
    })
})

router.get('/publicAccount', async (req, res) => {
    req.user.public = true;
    let userid = req.user._id;
    await Posts.updateMany({ postOwner: userid }, {
        public: true
    });
    res.render('profile', {
        user:req.user,
        msg:"You're account is public now! your profile and posts can be seen by anyone,"
    })
})

module.exports = router

