import mongoose from "mongoose";
import { UserDocument } from "./user.model";
import VerificationCodeType from "../constants/verificationCodeType";

export interface VerificationCodeDocument extends mongoose.Document {
  userId: UserDocument["_id"];
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);
export default VerificationCodeModel;
