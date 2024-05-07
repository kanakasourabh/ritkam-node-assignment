import { Router } from "express";
import {
  createGroupController,
  getGroupController,
  deleteGroupController,
  addMemberController,
  searchGroupsController,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = Router();

// Create a new group
router.route("/new-group").post(verifyJWT, createGroupController);

// Get group details
router.route("/group/:id").get(verifyJWT, getGroupController);

// Delete a group
router
  .route("/group/:id")
  .delete(verifyJWT, verifyAdmin, deleteGroupController);

// Add a member to a group
router
  .route("/group/:id/members")
  .post(verifyJWT, verifyAdmin, addMemberController);

// Search for groups
router.route("/group-search").get(verifyJWT, searchGroupsController);

export default router;
