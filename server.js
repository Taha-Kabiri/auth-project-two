const express = require('express') ;
const app = express();
const {body , validationResult} = require('express-validator');


global.config = require('./config/config.js');
let users = require('./user-list.js');


app.use(express.static(__dirname + "/public"));
app.use (express.urlencoded({extended : false}));
app.use(express.json());

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

app.post('/' , [
    body('email' , 'email is empty').isEmail(),
    body('password' , 'password min 5 length').isLength({ min : 5}) 
] ,  (req,res)=>{

const error = validationResult(req);
if(!error.isEmpty()){
    return res.status(422).json({
        data:null ,
        message : error.array()
    });
}

    console.log(req.body);
    req.body.id = parseInt(req.body.id);
    users.push(req.body);
    res.json({
        data:users,
        message:'کاربر اد شد '
    });
});

app.put('/:id' , (req,res)=>{
  users = users.map(user=>{
    if(user.id = req.params.id){
        return req.body ;
    }else{
        return user;
    }
  })
  res.json({
    data: users ,
    message : ' succssiful'
  })
})
 
app.listen(config.port , ()=> {
    console.log(`server running on port ${config.port} `)
});