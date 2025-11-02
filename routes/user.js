const express = require('express');
const router = express.Router();
const {body , validationResult} = require('express-validator');

let users = require('../user-list');





router.get('/' , (req,res)=>{
    
    res.render('user' , {users : users , title : 'همه کاربران '});
})
router.get('/:id' , (req,res)=>{
    let user = users.find((user)=>{
        if(user.id == req.params.id){
       return user ;
        };
    });

    res.render('update-user' , { user : user})
});

router.post('/' , [
    body('email' , 'email is empty').isEmail(),
    body('password' , 'password min 5 length').isLength({ min : 5}) 
] ,  (req,res)=>{

const error = validationResult(req);
if(!error.isEmpty()){
    return res.redirect('/api/user')
}

    console.log(req.body);
    req.body.id = parseInt(req.body.id);
    users.push(req.body);
    res.redirect('/api/user')
});

router.put('/:id' , (req,res)=>{
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
router.delete('/:id' , (req,res)=>{
    users = users.filter(user=>{
        if(user.id != req.params.id){
            return user;
        }
    })

    res.redirect('/api/user');
});


module.exports = router ; 