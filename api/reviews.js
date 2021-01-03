const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const Review = require('../models/Review')
const User = require('../models/User')
const router = express.Router()
const auth = require('./auth')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

require('dotenv').config()



router.get('/', auth, async (req,res)=>{

    const { token } = req

    try {
     
        jwt.verify(token, process.env.jwt_secret, async (err, authData)=>{
            if(err){
         
                return res.status(403).json({msg : err.message})
                
            }
       
            const user = await User.findById(authData.user._id).select('-password').populate('reviews')
            res.json(user)
            
        })
        
    } catch (err) {
   
        res.status(403).json({msg : "Backend error"})
    }

    
        
   
})


router.post('/add', auth, async (req,res)=>{
    const {title, rating, review} = req.body
    const { token } = req
    
    
    try {
        jwt.verify(token, process.env.jwt_secret, async (err, authData)=>{
            if(err){
             
                return res.status(403).json({msg : "Token validation failed."})
                
            }
            const new_review = new Review({title, rating, review})
            await new_review.save()
            
            const user = await User.findById(authData.user._id)
            if(!user){
                return res.status(400).json({ msg : "Invalid token"})
            }
            user.reviews.push(new_review._id)
            await user.save()
            return res.status(200).json(new_review)
            
        })
    } catch (err) {

       if(err._message === "Review validation failed"){
           res.status(400).json({msg : err._message})
       }
       
   }
   

})




router.delete('/delete/:id', auth, async (req, res)=>{
    const {token} = req 
    const review_id = req.params.id
    if(!ObjectId.isValid(review_id)){
        return res.status(400).json({msg : "Can't find the review you're trying to delete."})
    }
    try {
        jwt.verify(token, process.env.jwt_secret, async(err, authData)=>{
            if(err){
                res.status(403).json({msg : "Token validation failed."})
            }

            const review = await Review.findById(review_id)
            if(!review){
                return res.status(400).json({msg : "Can't find the review you're trying to delete."})
            }
            await review.delete()
            return res.status(200).json({msg : "Review deleted."})


        })
    } catch (err) {
        res.status(500).json({msg : "Backend error"})   
       
    }
})


router.put('/update/:id',[check('review', 'Please enter a new review').not().isEmpty()], auth, async (req,res)=>{
    const {token} = req 
    const new_review = req.body.review
    const review_id = req.params.id
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({msg : errors.array()})
    }
    
    if(!ObjectId.isValid(review_id)){
        return res.status(400).json({msg : "Can't find the review you're trying to delete."})
    }
   
    try {
        jwt.verify(token, process.env.jwt_secret, async(err, authData)=>{
            if(err){
                res.status(403).json({msg : "Token validation failed."})
            }

            const review = await Review.findByIdAndUpdate(review_id, { $set: { review: new_review }})
           
            return res.status(200).json({msg : "Review updated."})


        })
    } catch (err) {
        res.status(500).json({msg : "Backend error"})   
       
    }
})

module.exports = router


