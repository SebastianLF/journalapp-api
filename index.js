const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const notesRoute = require('./routes/notes')
const { verifyToken, signup, signin } = require('./utils/auth')


// Handles env variables
if(process.env.NODE_ENV !== 'production') require('dotenv').config({ debug: true })

// Connect to MONGODB
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}, () => {
    console.log('Connected to db!')
})

// to avoid getting error 
// (node:4378) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set('useCreateIndex', true)

app.use(cors())

if(process.env.NODE_ENV == 'development') app.use(require('morgan')('dev'))

// Parse JSON body
app.use(express.json())

// Routes
app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', verifyToken)
app.use('/api/notes', notesRoute)

app.listen(process.env.PORT, () => {
    console.log(`App is listening on port: ${process.env.PORT}!`);
})