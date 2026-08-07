import { Message } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({ success: true, data: message, message: null });
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, data: messages, message: null });
});

export const markMessageRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
  if (!message) return next(ApiError.notFound());
  res.json({ success: true, data: message, message: null });
});
