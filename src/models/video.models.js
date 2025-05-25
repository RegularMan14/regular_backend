import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,      //Cloud URL
        required: true
    },
    thumbnail: {
        type: String,      //Cloud URL
        required: true
    },
    title: {
        type: String,      
        required: true
    },
    description: {
        type: String,      
        required: true
    },
    duration: {
        type: Number,      //Cloud URL
        required: true
    },
    views: {
        type: Numeber,      
        required: true
    },
    isPublished: {
        type: Boolean,      
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: "User"
    },
}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)