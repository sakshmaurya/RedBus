const Report = require("../models/report");



// Create Report

exports.createReport = async (req, res) => {

try {


const {
    postId,
    reportedBy,
    reason
} = req.body;



const Post = require("../models/post");


// Check Post Exists

const post = await Post.findById(postId);


if(!post){

return res.status(404).json({

success:false,

message:"Post not found"

});

}




// Duplicate Report Check

const alreadyReported = await Report.findOne({

postId,

reportedBy

});



if(alreadyReported){

return res.status(400).json({

success:false,

message:"You already reported this post"

});

}




const report = await Report.create({

postId,

reportedBy,

reason: reason || "Inappropriate Content",

status:"Pending"

});




res.status(201).json({

success:true,

message:"Post Reported Successfully 🚩",

report

});


}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}

};








// Get Reports For Admin

exports.getAllReports = async(req,res)=>{


try{


const reports = await Report.find()

.populate({

path:"postId",

select:
"title description route destination status",

match:{
status:{
$ne:"hidden"
}
}

})


.populate({

path:"reportedBy",

select:
"name email"

})


.sort({

createdAt:-1

});




// Remove reports whose post deleted

const filteredReports = reports.filter(
(report)=> report.postId !== null
);



res.status(200).json({

success:true,

reports:filteredReports

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}

};








// Delete All Reports

exports.deleteAllReports = async(req,res)=>{


try{


await Report.deleteMany({});



res.json({

success:true,

message:"All reports deleted successfully"

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}

};









// Update Report Status

exports.updateReportStatus = async(req,res)=>{


try{


const {
status
}=req.body;



const allowedStatus = [
"Pending",
"Reviewed",
"Resolved",
"Rejected"
];



if(!allowedStatus.includes(status)){


return res.status(400).json({

success:false,

message:"Invalid report status"

});

}



const report = await Report.findById(
req.params.id
);



if(!report){


return res.status(404).json({

success:false,

message:"Report not found"

});

}



report.status = status;


await report.save();



res.json({

success:true,

message:"Report status updated",

report

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}

};