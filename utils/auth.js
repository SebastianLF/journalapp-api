const jwt = require('jsonwebtoken')
const User = require('../models/users.js')

const createToken = user => {
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '2h' })
}

exports.verifyToken = (req, res, next) => {

    // Get JWT token from authorization header, expect 'Bearer ey2r...'
    const token = req.headers.authorization && req.headers.authorization.toString().trim().split(' ')[1]
    console.log();
    
    // Check if token exist in header
    if (!token) return res.status(401).send({ message: 'Invalid token' })

    // Verify if token is valid
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        req.user = user

        next()
    } catch (e) {
        res.status(401).send({ message: 'Token not valid' })
    }
}

exports.signup = async (req, res) => {

    if (!req.body.password || !req.body.name) {
        return res.status(400).send({ message: 'Username or password are missing' })
    }

    try {

        // Checking if name is available
        const userFound = await User.findOne({ name: req.body.name }).exec()
        if(userFound) return req.status(400).send({ message: 'Username not available' })
        
        // create user
        const user = await User.create(req.body)
        const token = createToken(user.toJSON())

        return res.status(201).send(token)

    } catch (e) {

        return res.status(400).send(e)

    }
}

exports.signin = async (req, res) => {
    console.log(req);


    if (!req.body.password || !req.body.name) {
        return res.status(400).json({ message: 'Need username and password' })
    }

    // Sanitize inputs
    const user = {
        name: req.body.name.toString().trim(),
        password: req.body.password.toString().trim()
    }

    try {

        // Checking if user is already in the database
        const userFound = await User.findOne(user)
            .exec()

        if (!userFound) return res.status(400).send({ message: 'Wrong username or password' })

        const token = createToken(userFound.toJSON())

        res.send(token)

    } catch (e) {
        res.status(400).send(e)
    }
}