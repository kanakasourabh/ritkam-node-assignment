import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = (req, _, next) => {
  try {
    console.log(req.user);
    if (!req.user) {
      throw new ApiError(401, "Unauthorized user please login");
    }

    if (!req.user.isAdmin) {
      throw new ApiError(401, "Forbidden || Unauthorized user");
    }
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Server error || verifying admin");
  }
};

export { verifyAdmin };
