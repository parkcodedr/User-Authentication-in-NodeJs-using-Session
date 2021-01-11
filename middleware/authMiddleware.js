const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.webtoken;

    if (token) {
        jwt.verify(token, 'smartcodetech nigeria limited', (err, decodedToken) => {

            if (err) {
                console.log(err.message);
                res.redirect('/signin');
            } else {
                console.log(decodedToken);
                next();
            }
        });

    } else {
        res.redirect('/signin');
    }
}
//check logged in user
const checkUser = (req, res, next) => {
    const token = req.cookies.webtoken;
    res.locals.currentUser = null;
    if (token) {
        jwt.verify(token, 'smartcodetech nigeria limited', async (err, decodedToken) => {
            if (err) {
                //console.log(err.message);
                res.locals.currentUser = null;
                console.log(res.locals.currentUser);
                next();
            } else {
                //console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                //console.log(user, "user");
                res.locals.currentUser = user;
                next();
            }
        })
    } else {

        res.locals.currentUser = null;
        console.log(res.locals);
        next();
    }
}
module.exports = { requireAuth, checkUser }