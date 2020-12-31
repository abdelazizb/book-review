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

module.exports = Review = mongoose.model('Review', ReviewShema)