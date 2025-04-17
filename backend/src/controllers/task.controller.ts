import { Request, Response } from "express";
import Task from "../models/task.model";
import catchErrors from "../utils/catchErrors";
import { OK, CREATED, NOT_FOUND } from "../constants/http";
import appAssert from "../utils/appAssert";

export const createTask = catchErrors(async (req: Request, res: Response) => {

  console.log(req.userId);
  const task = await Task.create({
    ...req.body,
    userId: req.userId,
  });

  res.status(CREATED).json(task);
});

export const getAllTasks = catchErrors(async (req: Request, res: Response) => {
  const tasks = await Task.find({ userId: req.userId }); // Only get tasks for logged-in user
  res.status(OK).json(tasks);
});

export const getTaskById = catchErrors(async (req: Request, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.userId }); // Only find task if it belongs to logged-in user
  appAssert(task, NOT_FOUND, "Task not found or you are not authorized to access this task");
  res.status(OK).json(task);
});

export const updateTask = catchErrors(async (req: Request, res: Response) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId }, // Only update task if it belongs to the logged-in user
    req.body,
    { new: true, runValidators: true }
  );
  appAssert(task, NOT_FOUND, "Task not found or you are not authorized to update this task");
  res.status(OK).json(task);
});

export const deleteTask = catchErrors(async (req: Request, res: Response) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId }); // Only delete task if it belongs to logged-in user
  appAssert(task, NOT_FOUND, "Task not found or you are not authorized to delete this task");
  res.status(OK).json({ message: "Task deleted successfully" });
});
