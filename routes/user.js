const express = require('express');
const router = express.Router();
const {body , validationResult} = require('express-validator');


let users = require('../user-list');





router.get('/' , (req,res)=>{
    
    res.render('user' , {users : users , title : 'همه کاربران ' , errors : req.flash('errors')});
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
    body('email' , 'Enter your email.').isEmail(),
    body('password' , 'The minimum password characters are 5 ').isLength({ min : 5}) ,
    body('firstname' , 'Write your name, Martike.').isLength({ min : 2}),
    body('id' , 'Complete the ID').isLength({ min : 1})
] ,  (req,res)=>{

const error = validationResult(req);
if(!error.isEmpty()){
    req.flash('errors' , error.array());
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