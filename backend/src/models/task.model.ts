import mongoose from "mongoose";
import { boolean } from "zod";

export interface TaskDocument extends mongoose.Document {
  title: string;
  description: string;
  deadline: Date;
  isCompleted: boolean;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>(
  {
    title: { type: String, required: true },
    deadline: { type: Date, required: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default:false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // links to User collection
      required: true
    },

  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("task", taskSchema);
export default TaskModel;
