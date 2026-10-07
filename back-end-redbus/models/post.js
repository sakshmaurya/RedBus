const mongoose = require("mongoose");


const postSchema = new mongoose.Schema(
{

title: {
    type: String,
    required: true,
    trim: true,
},


description: {
    type: String,
    required: true,
    trim: true,
},


route: {
    type: String,
    default: "",
    trim: true,
},


destination: {
    type: String,
    default: "",
    trim: true,
},



images: [
    {
        type: String,
    }
],


// Pinned by Admin
isPinned: {
    type: Boolean,
    default: false,
},




// Post Owner

author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
},



authorName: {
    type: String,
    required: true,
},



authorProfile: {
    type: String,
    default: "",
},





// Engagement

likes: {
    type: Number,
    default: 0,
},



comments: {
    type: Number,
    default: 0,
},





// Admin Verification

isVerified: {
    type: Boolean,
    default: true,
},





// Community Moderation

status: {

    type: String,

    enum:[
        "active",
        "hidden",
        "deleted"
    ],

    default:"active"

},





// Report System

reportCount: {

    type:Number,

    default:0

},




adminNote: {

    type:String,

    default:""

},




},
{

timestamps:true

}

);



module.exports = mongoose.model(
"Post",
postSchema
);