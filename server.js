const express = require('express') ;
const app = express();
const methodOverride = require('method-override');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');



global.config = require('./config/config.js');



app.use(express.static(__dirname + "/public"));
app.use (express.urlencoded({extended : false}));
app.use(express.json());
app.set('view engine' , 'ejs');
app.use(methodOverride('method'));

app.use(cookieparser('jfkajgfjkjnhjfnhgjrabgfbdahfbrhg'));
app.use(session({
    secret:'asdfasdf65f6ffdsfdwe',
    resave:true,
    saveUninitialized : true ,
}));

app.use(flash());




app.use('/api/user' , require('./routes/user.js'));

 
app.listen(config.port , ()=> {
    console.log(`server running on port ${config.port} `)
});