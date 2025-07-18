import mongoose, { Document, Schema } from "mongoose";

export interface UserI extends Document {
    email: string;
    password: string;
}

const UserSchema = new Schema<UserI>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.models.User || mongoose.model<UserI>("User", UserSchema);

export default User;
