const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



router.post('/create',[ check('username', 'username is required and must have at least 5 characters').isLength({min : 5, max : 9}), check('password', 'password is required and must have at least 8 charachters').isLength({min : 8, max : 15})], async (req, res)=>{
  
  const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({msg : errors.array()})
    }
      
    //check if user already exists
    if(await User.findOne({username : req.body.username})){
        return res.status(400).json({msg : "username is not available!"})
    }

  
       
  try {
        //creating user fields
        const user_fields = {
            username : req.body.username,
            password : req.body.password
        }

        //hashing the password
        user_fields.password = await bcrypt.hash(req.body.password, 10)

        //intiating a user from the model
        const user = new User(user_fields)
        //saving it to the database
        await user.save()
        //sending response to front-end client
        return res.status(200).json(user)

    }catch (err) {
        console.error(err._message)
        res.status(500).json({msg : "server error"})
    }



})


router.post('/login', async (req, res)=>{

    const { username, password } = req.body
    try {
        const user = await User.findOne({username})
        
        if(!user){
            res.status(400).json({msg : "User does not exist."})
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).json({msg : 'Wrong password.'})
           
        }
       
      
        jwt.sign({user}, process.env.jwt_secret, (err, token)=>{
            return res.status(200).json({token})
        })
        
        
    } catch (err) {
        console.error(err.message)
        res.status(500).json({msg : 'Something went wrong !'})
    }

})













module.exports = router