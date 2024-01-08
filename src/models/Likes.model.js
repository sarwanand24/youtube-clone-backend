import mongoose, {Schema} from "mongoose";

const LikeSchema = new Schema({
       comment: {
        type: Schema.Types.ObjectId,
        ref: "Comments"
       },
       video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
       },
       likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
       },
       tweet: {
        type: Schema.Types.ObjectId,
        ref: "tweets"
       }
       
},{timestamps: true})

export const Likes = mongoose.model("Likes", LikeSchema);