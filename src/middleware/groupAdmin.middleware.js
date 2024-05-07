import { Group } from "../models/group.model.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const isAdminForGroup = AsyncHandler(async (userId, groupId) => {
  try {
    const result = await Group.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(groupId) } },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "creator",
        },
      },
      { $project: { isAdmin: { $arrayElemAt: ["$creator.isAdmin", 0] } } },
    ]);

    if (result.length > 0) {
      return result[0].isAdmin;
    }

    return false;
  } catch (err) {
    console.error("Error checking admin status for group:", err);
    throw new Error("Failed to check admin status for group");
  }
});
