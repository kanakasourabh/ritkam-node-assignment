import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const createGroupController = AsyncHandler(async (req, res) => {
  try {
    // Extract user ID of the creator from the request object
    const creatorId = req.user.id;
    const { name, description } = req.body;
    if (!name || !description) {
      throw new ApiError(400, "Group name and description required");
    }

    // Create a new group instance using the data from the request body
    const newGroup = await Group.create({
      name: req.body.name,
      description: req.body.description,
      members: req.body.members,
      createdBy: creatorId,
    });

    // Save the new group to the database
    if (!newGroup) {
      throw new ApiError(400, "Error creating Group");
    }

    // Check if the creator user is not already an admin
    const creatorUser = await User.findById(creatorId);
    if (creatorUser && !creatorUser.isAdmin) {
      creatorUser.isAdmin = true;
      await creatorUser.save();
    }

    // Send a 201 response with the newly created group object
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
    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Group deleted successfully" });
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server Error || deleting group");
  }
});

const addMemberController = AsyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId, req.params.id);
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



