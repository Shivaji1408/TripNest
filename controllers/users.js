const User = require('../models/user.js')

// signup From
module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

// sign up
module.exports.signup = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Tripnest");
            res.redirect('/listings');
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect('/signup');
    }
};

// login From
module.exports.loginForm = (req,res)=>{
    res.render('users/login.ejs');
};

// login
module.exports.login = async(req,res)=>{
    req.flash("success","Login on TripNest Successful");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'You are Logged Out!!!');
        res.redirect('/listings');
    })
};