const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
{
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },

    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customers",
        required:true
    },

    reason:{
        type:String,
        default:"Inappropriate Content"
    },

    status:{
        type:String,
        enum:["Pending","Reviewed"],
        default:"Pending"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Report",reportSchema);