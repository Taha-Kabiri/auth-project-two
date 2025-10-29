const express = require('express') ;
const app = express();


global.config = require('./config/config.js');
let users = require('./user-list.js');


app.use(express.static(__dirname + "/public"));


app.get('/:id' , (req,res)=>{
    let user = users.find((user)=>{
        if(user.id == req.params.id){
       return user ;
        };
    });

    res.json({
        data:user, 
    });

})

app.listen(config.port , ()=> {
    console.log(`server running on port ${config.port} `)
});