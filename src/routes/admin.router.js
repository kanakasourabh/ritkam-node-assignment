import { Router } from "express";
import {
  createUserController,
  editUserController,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Create a new user (accessible only to admin)
router.route("/create-users").put(verifyJWT, verifyAdmin, createUserController);

// Update user details (accessible only to admin)
router.route("/edit-users/:id").put(verifyJWT, verifyAdmin, editUserController);

export default router;
