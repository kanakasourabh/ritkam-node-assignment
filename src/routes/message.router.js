import { Router } from "express";
import {
  sendMessageController,
  likeMessageController,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyGroupMember } from "../middleware/groupMember.middleware.js";

const router = Router();

// Send a message in a group
router
  .route("/:groupId/send-message")
  .post(verifyJWT, verifyGroupMember, sendMessageController);

// Like a message
router
  .route("/message/:groupId/:messagId/like")
  .post(verifyJWT, verifyGroupMember, likeMessageController);

export default router;
