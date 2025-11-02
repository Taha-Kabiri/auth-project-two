const express = require('express') ;
const app = express();
const methodOverride = require('method-override');


global.config = require('./config/config.js');



app.use(express.static(__dirname + "/public"));
app.use (express.urlencoded({extended : false}));
app.use(express.json());
app.set('view engine' , 'ejs');
app.use(methodOverride('method'));



app.use('/api/user' , require('./routes/user.js'));

 
app.listen(config.port , ()=> {
    console.log(`server running on port ${config.port} `)
});