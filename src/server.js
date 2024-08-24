//App requirements
const express = require("express");
const app = express();
const path = require("path")
const mongo = require('mongodb')
const mong = require('mongoose')
const bcrypt = require("bcrypt")
const passport = require('passport')
const bodyParser = require("body-parser");
const { name } = require("ejs");
const session = require('express-session')
const flash = require('express-flash')
const methodOverride = require('method-override')
const { measureMemory } = require("vm");
const { Server } = require('socket.io');
const MongoStore = require('connect-mongo')
const MongoClient = mongo.MongoClient;
const getPort = require('./password-config.js');
const { listenerCount } = require("process");
const { connect } = require("http2");
uri = 'mongodb://localhost:27017/list'

//Schemas for storing users and users lists
const list_schema = new mong.Schema({
    name:String,
    favorite : {type: Boolean, default: false},
    dateCreated: {
        date : String,
        time : String
    },
    dateUpdated: {
        dateUp : String,
        timeUp : String
    },
    theme : {type : String, default : ''},
    todo: { type: Object, default: {} }
},{minimize: false})
const user_data = new mong.Schema({
    username: String,
    email: String,
    password: String,
    lists : [list_schema]
},{collection : 'list'});
const user_model = mong.model('User', user_data);

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, '..', 'public'));//paths for the public info like htmls files/css
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('images', express.static(path.join(__dirname, '..', 'public/imgs')))//images or icons that are used
app.use(express.json())
app.use(methodOverride('_method'))
app.use(flash())
app.use(bodyParser.urlencoded({extended: true}))
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//setting up the passport authenticator *_*
getPort.initialize(
    passport,  
    email => user_model.findOne({email : email}),
    id => user_model.findOne({_id : id})

)
//function for connecting to the mongodb database
async function run(){
try{
    await client.connect();
    const db = await client.db("list")
    const collection = db.collection('list');
    await mong.connect('mongodb://127.0.0.1:27017/test');
    console.log("\u001b[1;36m Successfully connected to MongoDB!");
 }finally {
   console.log('Connection done')
 }
}
run().catch(console.dir);
//                            ____     __
//                           / :) \   /   \
//session settings and such ( -___-) (-__-  )
const sessionMiddleware = session({
    secret: 'super-secret-key-for-ultra-security',//secret key of the future 
    resave: false,
    saveUninitialized: false,
    cookie: false,
    store : MongoStore.create({
        mongoUrl : 'mongodb://127.0.0.1:27017/list',
        dbName : 'test',
        ttl : 24 * 60 * 60,
        autoRemove : 'native',
    })
})
app.use(sessionMiddleware)

app.use(passport.initialize())
app.use(passport.session())
const server = app.listen(8000);
const io = new Server(server).use(function(socket, next){
        // Wrap the express middleware
        sessionMiddleware(socket.request, {}, next);
    });

//routes ||
//       \/
app.get('/user/list/:list_name', Logedin, async (req, res) => {
    const userid = new mong.Types.ObjectId(req.session.passport.user)
    const user =  await user_model.findById(userid)
    try{
        const list_target = user_model.findOne({
        username : user.username,
        'lists.name' : req.params.list_name
    }, {
        'lists.$' : 1
    }).then((data) => {
        res.render("index.ejs", {list : data.lists[0]})
    })
}catch(err){
     console.log(err)
}
});
app.get("/register", NotLoged, function(req, res) {
    res.render('log.ejs', {message :''})
})

app.post("/register", NotLoged,  async function(req, res) {
    try{
        if (await user_model.findOne({username: req.body.username})) {
        res.render('log.ejs', {message : 'This username is already in use'})
    }
    else if(await user_model.findOne({email: req.body.email})) {
        res.render('log.ejs', {message : 'This email is already in use'})
    }
    else if(req.body.password !== req.body.password2) {
        res.render('log.ejs', {message : "The passwords don't match"})
    }else{
        const newUser = new user_model({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10),
            email: req.body.email
        });
        await newUser.save()
        res.redirect('/' + req.body.username + '/dashboard')
    }

}catch(error) {
    console.log(error);
}
})
app.get('/login', NotLoged, function(req, res) {
    res.render('login.ejs', {message : ''})
})
app.post('/login', NotLoged, passport.authenticate('local', {
    successRedirect: '/erf/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get("/dashboard", Logedin, async function(req, res) {
const userid = new mong.Types.ObjectId(req.session.passport.user)
const user = await user_model.findById(userid)
res.render("dashboard.ejs", {lists : user.lists.sort(user.lists.dateCreated, 'asc'), username : user.username})
})
io.on("connection", function(socket) {
    console.log('user has successfully connected to the server');

    socket.on('send', async function(arg, list, callback) {
        console.log( "\u001b[1;34m" + list);
        const userid = new mong.Types.ObjectId(socket.request.session.passport.user)
        const user =  await user_model.findById(userid)
        try{
            const list_target = await user_model.findOneAndUpdate(
                {

                  username: user.username,
                  'lists.name': arg
                },
                {
                  $set: {'lists.$.dateUpdated.dateUp': getDate()},
                  $set: {'lists.$.dateUpdated.timeUp': getTime()},
                  $set: { 'lists.$.todo': JSON.parse(list) }
                },
                { new: true, runValidators: true }
              )
        

        user.save()
        callback('Data received succesfuly')
    }catch(err){
         console.log(err)
    }

        
    });

    socket.on('disconnect', function() {
        console.log('user has disconnected');
    });
});

/*let savedtimes = 0;
app.post("/:list_name/save", Logedin, async function(req, res) {
    savedtimes +=1
    console.log('saving...' + savedtimes)
    const userid = new mong.Types.ObjectId(req.session.passport.user)
    const user =  await user_model.findById(userid)
    try{
        const list_target = await user_model.findOneAndUpdate(
            {
              username: user.username,
              'lists.name': req.params.list_name
            },
            {
              $set: {'lists.$.dateUpdated.dateUp': getDate()},
              $set: {'lists.$.dateUpdated.timeUp': getTime()},
              $set: { 'lists.$.todo': req.body }
            },
            { new: true, runValidators: true }
          ).then(res.status(200));
    user.save()
}catch(err){
     console.log(err)
     res.status(400)
}
})
*/

app.post("/:list_name/request", Logedin, async function(req, res) {
    const userid = new mong.Types.ObjectId(req.session.passport.user)
    const user = await user_model.findById(userid)
    try{
        const list_target = await user_model.findOne(
            {
              username: user.username,
              'lists.name': req.params.list_name
            },
            {
                lists: { $elemMatch: { name: req.params.list_name } }
              }
          )
    try {
            res.json(list_target.lists[0].todo)
            console.log("\u001b[1;32m" + "sent the requested data to the client")
    }catch(err) {
        console.log("\u001b[1;31m" + err)
    }

}catch(err){
     console.log(err)
}

})
app.post('/create-list',Logedin, async function(req, res) {
     try{    
        if(req.session.passport.user !== undefined) {
        const userid = new mong.Types.ObjectId(req.session.passport.user)
        const user = await user_model.findById(userid)
        const list = await CreateNewList(req.body.name, req.body.theme);
        user.lists.push(list)
        console.log(list)
        await user.save().then(console.log('saved succesfully'))
    }else{
        console.log('could not identify user')
    }}catch(e) {
        console.log(e)
    }

})
app.get("/account", Logedin, function(req, res) {
res.render("account-settings.ejs")
})
app.delete('/logout', function(req, res) {
    req.logout(function(err) {
      if (err) { console.log(err); }
      res.redirect('/login');
    });
  });
function Logedin(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}
function NotLoged(req, res, next) {
    if(!req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
async function CreateNewList(listName, theme_nr) {
    const date = new Date(Date.now())
    const newList = {
        name : listName,
        dateCreated : {
            date : date.toLocaleDateString('en-GB'),
            time : date.toLocaleTimeString('en-GB')
        },
        dateUpdated : {
            dateUp : date.toLocaleDateString('en-GB'),
            timeUp : date.toLocaleTimeString('en-GB')
        },
        theme : 'theme' + theme_nr,
        todo: {}
    }
    return newList
}
function getDate() {
    const date = new Date(Date.now())
    return date.toLocaleDateString('en-GB')
}
function getTime() {
    const date = new Date(Date.now())
    return date.toLocaleTimeString('en-GB')
}


