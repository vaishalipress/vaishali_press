import mongoose, { Schema } from "mongoose";

interface UserI {
    userId: string;
    password: string;
}

const UserSchema = new Schema<UserI>({
    userId: {
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
