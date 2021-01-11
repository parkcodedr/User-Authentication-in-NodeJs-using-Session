const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    let errors = { email: '', password: '' };

    //unique email validation
    if (err.code === 11000) {
        errors.email = 'email Already Registered';
        return errors;
    }
    //incorrect email
    if (err.message === "incorrect email") {
        errors.email = "Email not registered";
    }
    //incorrect password
    if (err.message === "incorrect password") {
        errors.email = "Password not correct";
    }

    //validate errors
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
            //console.log(properties);
        });
    }
    return errors;

}
//generate jwt web token
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'smartcodetech nigeria limited', {
        expiresIn: maxAge
    });
}

const sign_up_get = (req, res) => {
    res.render('signup');
}

const sign_up_post = async (req, res) => {
    //const { email, password } = req.body;

    try {

        const user = new User({
            email: req.body.email,
            password: req.body.password
        })
        if (req.file) {
            user.avater = req.file.path
        }
        newUser = await user.save();
        //const user = await User.create({ email, password });
        const token = createToken(newUser._id);
        res.cookie('webtoken', token, { secure: true, httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: newUser._id });
        res.send(newUser._id);
    } catch (error) {

        const errors = handleError(error);

        res.status(400).json({ errors });
    };

}
const sign_in_get = (req, res) => {
    res.render('signin');
}

const sign_in_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('webtoken', token, { secure: true, httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors });
    }
}
const logout_get = (req, res) => {
    res.cookie('webtoken', '', { maxAge: 1 });
    res.redirect('/signin');
}
const sign_up = (req, res) => {
    res.render('signup');
}
module.exports = {
    sign_up_get,
    sign_up_post,
    sign_in_get,
    sign_in_post,
    logout_get,
    sign_up
}