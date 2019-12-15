import passport from 'passport';
import routes from '../routes';
import User from '../models/User';
import { log } from 'util';

export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res, next) => {
    const {
        body: {
            name,
            email,
            password,
            password2
        }
    } = req;

    if (password !== password2) {
        res.status(400);
        res.render("join", {pageTitle: "Join"});
    } else {
        try {
            // To Do: Register User
            const user = await User({
                name, 
                email,
            });
            User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            // To Do: Log user in
            res.redirect(routes.home);
        }
    }
}
export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"});
}
export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home,
});

export const githubLogin = passport.authenticate('github');
export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile, cb);
    const { _json: {
        id,
        avatar_url,
        name,
        email,
    }} = profile;

    try {
        const user = await User.findOne({
            email
        });

        if (user) {
           user.githubId = id;
           user.save();
           return cb(null, user);
        }

        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl: avatar_url,
        });
        return cb(null, newUser);
    
        console.log(user);
    } catch (error) {
        return cb(error);
    }
}

export const postGitHubLogin = (req, res) => {
    res.redirect(routes.home);
}

export const facebookLogin = passport.authenticate('facebook');

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const { _json: {
        id,
        name,
        email,
    }} = profile;

    try {
        const user = await User.findOne({
            email
        });

        if (user) {
           user.facebookId = id;
           user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
           user.save();
           return cb(null, user);
        }

        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
        });
    } catch (error) {
        return cb(error)
    }

    console.log(accessToken, refreshToken, profile, cb);
}

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
}

export const logout = (req, res) => {
    req.logout();
    // To Do: Process Log Out
    res.redirect(routes.home);
}

export const users = (req, res) => res.render("users", {pageTitle: "Users"});

export const getMe = (req, res) => {
    res.render("userDetail", {pageTitle: "UserDetail", user: req.user});
}

export const userDetail = async (req, res) => {
    const { params: {
        id
    }} = req;
    try {
        console.log("들어오긴하니??");
        const user = await User.findById(id);
        res.render("userDetail", {pageTitle: "UserDetail", user});
    } catch (error) {
        res.redirect(routes.home);
    }
}
export const editProfile = (req, res) => res.render("editProfile", {pageTitle: "EditProfile"});
export const changePassword = (req, res) => res.render("changePassword", {pageTitle: "ChangePassword"});