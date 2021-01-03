const mongoose = require('mongoose')


const requiredString = {
    type : String,
    required : true
}

const ReviewShema = mongoose.Schema({
    title : requiredString,
    review : requiredString,
    rating : {
        type : Number,
        required : true,
        default : 0
    }
})

const UserSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    reviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
    }]    
})


module.exports = User = mongoose.model('User', UserSchema)
