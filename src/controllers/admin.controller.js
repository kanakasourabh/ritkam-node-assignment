import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createUserController = AsyncHandler(async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    const { username, email, password, isAdmin } = req.body;
    if (!username || !email || !password || isAdmin) {
      throw new ApiError(400, "All fields are mandatory");
    }
    // Create user
    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(new ApiResponse(201, { newUser }));
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server error while craeting user by admin");
  }
});

const editUserController = AsyncHandler(async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(201).json(new ApiResponse(201, { updatedUser }));
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error while editing user");
  }
});

export { createUserController, editUserController };
