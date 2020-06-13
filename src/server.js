const exphbs = require('express-handlebars');
const morgan = require("morgan");
const methodOverride = require('method-override')
const express = require('express');
const flash = require('connect-flash');
const session =require('express-session')
const passport = require('passport')
// Import path to concatenate a direction and a filename.
const path = require('path');
// initialization 
const app = express();
require('./config/passport');
// seting port, if i have a enviroment variable, mi app will use it. Else it'll use 3000
app.set('port', process.env.PORT||3000);
//views
app.set('views',path.join(__dirname,'views'));
// engine setting
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
  
}));
app.set('view engine','.hbs');


//midleware

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

// static files
app.use(express.static(path.join(__dirname,'public')));
// Goblal variables
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routers 
app.use(require('./routes/index.routes'));
app.use(require('./routes/notes.routes'));
app.use(require('./routes/users.routes'));


module.exports = app;