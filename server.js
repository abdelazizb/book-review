const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 8080
require('dotenv').config()


mongoose.connect(process.env.db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, ()=>console.log('connection to database established!'))

app.use(cors({
	"origin": "*"
}))
app.use(express.json({extended : false}))

app.listen(PORT,()=>{
	console.log(`server started, go to: http://localhost:${PORT}`)
})


app.use('/api/reviews', require('./api/reviews'))
app.use('/api/users', require('./api/users'))