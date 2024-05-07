import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const sendMessageController = AsyncHandler(async (req, res) => {
  try {
    const group_id = req.params.groupId;
    const { message } = req.body;
    const userId = req.user._id;
    const newMessage = await Message.create({
      sender: userId,
      group: group_id,
      content: message,
    });
    if (!newMessage) {
      throw new ApiError(500, "error sending message");
    }

    res.status(201).json(new ApiResponse(201, { newMessage }));
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server error while sending message");
  }
});

const likeMessageController = AsyncHandler(async (req, res) => {
  try {

    const message = await Message.findById(req.params.messagId);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    message.likes.push(req.user.id);
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    throw new ApiError(500, "Server error");
  }
});

export { sendMessageController, likeMessageController };
