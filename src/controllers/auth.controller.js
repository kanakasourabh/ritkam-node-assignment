import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(500, "User not found");
    }

    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Something went wrong while generating Token");
  }
};



const registerController = AsyncHandler(async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, { error: errors?.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, "User already exists");
    }

    // Create new user
    user = await User.create({
      username,
      email,
      password,
    });

    if (!user) {
      throw new ApiError(400, "Failed creating new User");
    }

    return res.status(201).json(
      new ApiResponse(201, {
        msg: "User registered successfully",
        user: user,
      })
    );
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error while craeting uer");
  }
});

const loginController = AsyncHandler(async (req, res) => {
  try {

    const { email, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Check if password is correct
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      throw new ApiError(400, "Invalid Password");
    }


    // Generate JWT token
    const accessToken = await generateToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password ");
    const options = {
      httpOnly: true,
      secure: false,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
          },
          "User logged in successfully"
        )
      );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const logoutController = AsyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerController, loginController, logoutController };
