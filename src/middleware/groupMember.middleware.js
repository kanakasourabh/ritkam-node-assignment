import { Group } from "../models/group.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const verifyGroupMember = AsyncHandler(async (req, _, next) => {
  try {
    const userId = req.user._id;

    const group_id = req.params.groupId || req.body.groupId;

    if (!req.user) {
      throw new ApiError(401, "Unauthorized user please login");
    }

    const group = await Group.findOne({ _id: group_id, members: userId });

    if (!group) {
      throw new ApiError(401, "User is not a member of group");
    }
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Server error || verifying group member");
  }
});

export { verifyGroupMember };
