import passport from 'passport';
import GithubStrategy from 'passport-github';
import FacebookStrategy from 'passport-facebook';
import routes from './routes';
import User from './models/User';
import { githubLoginCallback, facebookLoginCallback } from './controllers/userControllers';

passport.use(User.createStrategy());

passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: `http://localhost:4000${routes.gitHubCallback}`,
    },
    githubLoginCallback
    )
);
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `https://c2226cda.ngrok.io${routes.facebookCallback}`,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        scope: ['public_profile', 'email'],
    },
    facebookLoginCallback,
    )
)

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());