import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, getCollections } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateToken } from "../utils/validateToken.js";

const router = Router();

router.route('/register').post(upload.fields([
    { name: 'avatar', maxCount: 1 },]),
    registerUser);


router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/validate-token').get(validateToken);

router.route('/get-collections').get(verifyJWT, getCollections);

export default router;