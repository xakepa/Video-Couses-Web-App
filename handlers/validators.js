const Users = require('../models/user');

const registerValidator = async (req, res, next) => {

    const { username, password, rePassword } = req.body;

    let error = '';

    const user = await Users.findOne({ email: username });
    const passwordValidator = /^(?=.*[0-9])(?=.*[a-zA-Z])\w{6,}$/

    if (user) {
        error = 'Username already exist';
    } else if (password !== rePassword) {
        error = 'Passwords do not much';
    } else if (password.length < 6) {
        error = 'Password should be at least 6 digits and letters';
    } else if (!(password.match(passwordValidator))) {
        error = 'Password should be mix consisting at least one digit and only english letters';
    }

    if (error) {
        return res.render('./guest/register', {
            error
        })
    }
    next();
}

const courseFormValidator = (req, res, next) => {

    const { title, description, isPublic, imageUrl } = req.body;

    let error = '';
    if (title.length < 4) {
        error = 'The title should be at least 4 characters';
    } else if (description.length < 20) {
        error = 'The description should be at least 20 characters long';
    } else if (!(imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        error = 'Image url must start with http:// or https://';
    }

    if (error) {
        return res.render('create-course', {
            isLogged: res.isLogged,
            username: res.email,
            error
        })
    }
    next()
}

module.exports = { registerValidator, courseFormValidator }