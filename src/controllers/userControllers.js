import passport from 'passport';
import { log } from 'util';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const postJoin = async (req, res, next) => {
  const {
    body: {
      name,
      email,
      password,
      password2,
    },
  } = req;

  if (password !== password2) {
    req.flash('error', 'Password don`t match');
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
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
};
export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};
export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: 'Welcome',
  failureFlash: "Can't login. Check email and/or password",
});

export const githubLogin = passport.authenticate('github', {
  successFlash: 'Welcome',
  failureFlash: "Can't login. Check email and/or password",
});
export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  const {
    _json: {
      id,
      avatar_url,
      name,
      email,
    },
  } = profile;

  try {
    const user = await User.findOne({
      email,
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
  } catch (error) {
    return cb(error);
  }
};

export const postGitHubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: "Can't login. Check email and/or password",
});

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
  const {
    _json: {
      id,
      name,
      email,
    },
  } = profile;

  try {
    const user = await User.findOne({
      email,
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
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash('info', 'Logged out, see you later');
  req.logout();
  // To Do: Process Log Out
  res.redirect(routes.home);
};

export const users = (req, res) => res.render('users', { pageTitle: 'Users' });

export const getMe = (req, res) => {
  res.render('userDetail', { pageTitle: 'UserDetail', user: req.user });
};

export const userDetail = async (req, res) => {
  const {
    params: {
      id,
    },
  } = req;
  try {
    const user = await User.findById(id).populate('videos');
    console.log(user);
    res.render('userDetail', { pageTitle: 'UserDetail', user });
  } catch (error) {
    req.flash('error', 'User not found');
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) => {
  res.render('editProfile', { pageTitle: 'EditProfile' });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash('success', 'Profile updated');
    res.redirect(routes.me);
  } catch (error) {
    console.log(error);
    res.flash('error', "Can't update profile");
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageTitle: 'ChangePassword' });
};

export const postChangePassword = async (req, res) => {
  const {
    body: {
      oldPassword,
      newPassword,
      newPassword1,
    },
  } = req;

  try {
    if (newPassword !== newPassword1) {
      req.flahs('error', "Passwords don't match");
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flahs('error', "Can't change password");
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
