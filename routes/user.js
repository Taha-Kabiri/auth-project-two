const express = require('express');
const router = express.Router();
let Users = require('./../model/user');
const {body , validationResult} = require('express-validator');




router.get('/' , async (req,res)=>{
    let users = await Users.find({});
    res.render('user' , {users : users , title : 'همه کاربران ' ,
        errors : req.flash('errors') , message : req.flash('message')});
})
router.get('/:id' , async(req,res)=>{
    let user = await Users.findById(req.params.id)
    
    res.render('update-user' , { user : user})
});

router.post('/' , [
    body('email' , 'Enter your email.').isEmail(),
    body('password' , 'The minimum password characters are 5 ').isLength({ min : 5}) ,
    body('firstname' , 'Write your name, Martike.').isLength({ min : 2}),
   
] ,  async (req,res)=>{

const error = validationResult(req);
if(!error.isEmpty()){
    req.flash('errors' , error.array());
    return res.redirect('/api/user')
}

    console.log(req.body);
    req.body.id = parseInt(req.body.id);
    let newUser = await new Users({
        firstname : req.body.firstname ,
        email : req.body.email ,
        password : req.body.password 
    })
    await newUser.save();
    req.flash('message' , 'User created successfully.');
    res.redirect('/api/user')
});

router.put('/:id' , async (req,res)=>{
  const users = await Users.updateOne({_id : req.params.id} , {$set : req.body});
  req.flash('message' , 'user update is Successflly');
  res.redirect('/api/user');

  })

router.delete('/:id' , async (req,res)=>{
  await Users.deleteOne({_id : req.params.id});

    req.flash('message' , ' user deleted is Successflly')
    res.redirect('/api/user');
});


module.exports = router ; 