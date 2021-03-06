const express = require('express')
const asyncHandler = require('express-async-handler');
const {setTokenCookie, restoreUser} = require('../../utils/auth')
const {User} = require('../../db/models')

const router = express.Router()


// Log In
router.post(
    '/', asyncHandler(async (req, res, next) => {
        const { credential, password } = req.body
        const user = await User.login({ credential, password })
        if (!user) {
            const err = new Error('Login Failed')
            err.status = 401
            err.title = 'Login failed'
            err.errors = ['The provided credentials were invalid']
            return next(err)
        }
        await setTokensCookie(res, user)
        
        return res.json({
            user,
        })
    } )
)

// Log Out
router.delete('/', (_req, res) => {
    res.clearCookie('token')
    return res.json({message: 'success'})
})

module.exports = router