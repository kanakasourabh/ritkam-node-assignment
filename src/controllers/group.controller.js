import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createGroupController = AsyncHandler(async (req, res) => {
  try {
    const creatorId = req.user.id;
    const { name, description, members } = req.body;
    if (!name || !description) {
      throw new ApiError(400, "Group name and description required");
    }

    const newGroup = await Group.create({
      name,
      description,
      members: members ? [...members, creatorId] : [creatorId],
      createdBy: creatorId,
    });

    if (!newGroup) {
      throw new ApiError(400, "Error creating Group");
    }

    const creatorUser = await User.findById(creatorId);
    if (creatorUser && !creatorUser.isAdmin) {
      creatorUser.isAdmin = true;
      await creatorUser.save();
    }

    res.status(201).json(new ApiResponse(201, { newGroup }));
  } catch (err) {
    console.error("Error creating group:", err);
    throw new ApiError(500, "Failed to create group");
  }
});

const getGroupController = AsyncHandler(async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    res.json(group);
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error || finding group");
  }
});

const deleteGroupController = AsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const groupCreator = Group.findOne({ createdBy: userId });
    if (!groupCreator) {
      throw new ApiError(500, "Only creator or admin can delete the group");
    }
    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Group deleted successfully" });
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error || deleting group");
  }
});

const addMemberController = AsyncHandler(async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      throw new ApiError(404, "Group not found");
    }

    group.members.push(req.body.userId);
    await group.save();

    res.status(200).json(group);
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error || adding member");
  }
});

const searchGroupsController = AsyncHandler(async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const groups = await Group.find({
      name: { $regex: keyword, $options: "i" },
    });

    if (!groups) {
      throw new ApiError(402, "Group not found");
    }
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server error while finding group");
  }
});

export {
  createGroupController,
  getGroupController,
  deleteGroupController,
  addMemberController,
  searchGroupsController,
};
