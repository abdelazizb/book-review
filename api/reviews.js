const express = require('express')
const Review = require('../models/Review')
const router = express.Router()
const auth = require('./auth')
const jwt = require('jsonwebtoken')
require('dotenv').config()



router.get('/', auth, async (req,res)=>{

    const { token } = req

    try {
        jwt.verify(token, process.env.jwt_secret, (err, authData)=>{
            if(err){
                console.log(err)
                return res.status(403).json({msg : err.message})
                
            }
            return res.status(200).json({authData})
        })
    } catch (err) {
        console.error(err.message)
        res.status(403).json({msg : "Not authorized."})
    }

    
        
    /*
    

    try {
        let posts = await Review.find()
        return res.status(200).json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({msg : "Server error"})
    }
*/
})


router.post('/', async (req,res)=>{
   const {title, rating, review} = req.body

   try {
     
       
       const new_review = new Review({title, rating, review})
       const rev = await new_review.save()
       return res.status(200).json(rev)
       
   } catch (err) {
       console.error(err.message)
       if(err._message === "Review validation failed"){
           res.status(400).json({msg : err._message})
       }
       
   }
   

})

module.exports = router


