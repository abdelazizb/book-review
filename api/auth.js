function auth(req, res, next){
    const bearerHeader = req.headers['custom-auth']


    if(typeof bearerHeader !== "undefined"){
        const token = bearerHeader.split(' ')[1]
        req.token = token
        next()
    }else{
        res.status(403).json({msg : "Access denied."})
    }
}





module.exports = auth


