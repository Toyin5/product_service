import "dotenv/config";
import mongoose, { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verifyPassword(candidatePassword: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: [2, "First name must be at least 2 characters long"],
      max: [50, "First name must not be more than 50 characters long"],
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      min: [2, "Last name must be at least 2 characters long"],
      max: [50, "Last name must not be more than 50 characters long"],
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      min: [8, "Password must be at least 8 characters long"],
      required: [true, "Password field is required"],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  return next();
});
userSchema.method(
  "verifyPassword",
  async function (
    this: HydratedDocument<UserDocument>,
    candidatePassword: string
  ) {
    if (!this.password) {
      return false;
    }
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
  }
);

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
