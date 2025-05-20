import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {executeCode, leaveRoom, verifyPasskey, createRoom } from "../controllers/room.controller.js";
import { savecode } from "../controllers/codes.controller.js";

const router = Router();


router.route('/execute-code').post(verifyJWT, async (req, res) => {

    const { code, language, input } = req.body;

    const result = await executeCode(code, language, input);
    
    return res.status(200).json(new ApiResponse(200, "Code executed successfully", result));
});

router.route('/verify-key').post(verifyJWT, verifyPasskey);

router.route('/create-room').post(verifyJWT, createRoom);
router.route('/leave-room').post(verifyJWT, leaveRoom);
router.route('/add-code').post(verifyJWT, async (req, res) => {

    await savecode(req, res);

});




export default router;