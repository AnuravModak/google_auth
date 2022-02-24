const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const indexRouter=require('./routes/index');
const path=require('path');
const passport = require('passport');
var session=require('express-session');
var authRouter=require('./routes/auth');

var MongoStore = require('connect-mongo');

const app=express();

// now i want to run the below code only for development mode:
// logging:
if (process.env.NODE_env==='development'){
  app.use(morgan("dev"));
}



const PORT=process.env.PORT||5050;
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_env} mode on ${PORT}`);

});
// Load env:
dotenv.config({path:'./config/config.env'});

// passport config
require('./config/passport')(passport);


const connect=mongoose.connect('mongodb://localhost:27017/project_5', {useNewUrlParser: true, useCreateIndex:true,useUnifiedTopology: true });

connect.then((db) => {
  console.log(`Connected to DataBase project_5`);
}, (err) => { console.log(err); });


app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/project_5',
    })
  })
)


// Passport middle ware
app.use(passport.initialize());
app.use(passport.session())


// Static files
app.use(express.static(path.join(__dirname,'public')));
// setting the absolute path to this directory....by using __dirname

// Handlebars
app.engine('.hbs',exphbs({defaultLayout:'main',extname:'.hbs'}));
// here i am setting the extension as ".hbs" rather than ".handlebars"
app.set('view engine','.hbs');

// Routes
app.use('/',indexRouter);
app.use('/dashboard',indexRouter);
app.use('/auth',authRouter);


// commands to run "npm run dev" or "npm start"....prefer "npm run dev"






