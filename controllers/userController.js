const Controller = require('./controller');
let Users = require('./../model/user');
const {body , validationResult} = require('express-validator');


class UserController extends Controller {

  async getAllUsers (req,res){
     let users = await Users.find({});
     res.render('user' , {users : users , title : 'همه کاربران ' ,
         errors : req.flash('errors') , message : req.flash('message')});
 }
  async seeOneUser(req,res){
     let user = await Users.findById(req.params.id)
     
     res.render('update-user' , { user : user})
 }

  async creatUser(req,res){

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
}
async updateUser (req,res){
  const users = await Users.updateOne({_id : req.params.id} , {$set : req.body});
  req.flash('message' , 'user update is Successflly');
  res.redirect('/api/user');

  }
  async deleteUser (req,res){
  await Users.deleteOne({_id : req.params.id});

    req.flash('message' , ' user deleted is Successflly')
    res.redirect('/api/user');
}
};

module.exports = new UserController ;