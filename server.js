if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt =  require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializepassport= require('./passport-config')
const expressEjsLayouts = require('express-ejs-layouts')
initializepassport(
    passport, 
    ntid=> users.find(user => user.ntid === ntid),
    id=> users.find(user => user.id === id)
)

//database
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

  // Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBKt0oA8WHPDJJMltI57PTYELYs1vH0p1g",
    authDomain: "ad-webapp-ee28e.firebaseapp.com",
    databaseURL: "https://ad-webapp-ee28e.firebaseio.com",
    projectId: "ad-webapp-ee28e",
    storageBucket: "ad-webapp-ee28e.appspot.com",
    messagingSenderId: "985773520639",
    appId: "1:985773520639:web:28ff8bd18cd05999077eca"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);


const users = []

app.set('view-engine', 'ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressEjsLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use (flash())
app.use (session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/',checkAuthenticated, (req,res) => {
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login',checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated,async(req,res)=>{
    try{
        const hashedpassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name:req.body.name,
            ntid:req.body.ntid,
            password:hashedpassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/login')
})


function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated (req,res,next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
app.listen(3000)