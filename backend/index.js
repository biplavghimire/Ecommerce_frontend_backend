const express = require('express')
require('dotenv').config()
require('./database/connection')

const UserRoute = require('./routes/userRoute')

const cors = require('cors')
const morgan = require('morgan')

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use(morgan('dev'))

app.use('/api', UserRoute)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})
