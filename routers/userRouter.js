import express from 'express';
import routes from '../routes';
import { users, userDetail, editProfile, changePassword } from '../controllers/userControllers';
import { onlyPrivate } from '../middlewares';

const userRouter = express.Router();

userRouter.get("/", users);
userRouter.get(routes.editProfile, onlyPrivate, editProfile);
userRouter.get(routes.changePassword, onlyPrivate, changePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;