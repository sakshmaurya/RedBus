const Post = require("../models/post");
const Report = require("../models/report");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const NotificationService = require("../services/notificationService");


// Upload Image To Cloudinary using unsigned upload
const uploadToCloudinary = (file)=>{

return new Promise((resolve,reject)=>{

console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Not set",
  upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET ? "Set" : "Not set",
  preset_value: process.env.CLOUDINARY_UPLOAD_PRESET
});

// Check if Cloudinary is configured
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_UPLOAD_PRESET) {
  console.log("Cloudinary not configured, using base64 fallback");
  // Convert image to base64 for local testing
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  resolve(base64);
  return;
}

const stream = cloudinary.uploader.upload_stream(

{
upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "redbus_unsigned",
folder: "redbus-community",
resource_type: "auto"
},

(error,result)=>{

if(error){

console.log("Cloudinary Upload Error:", error);
console.log("Error details:", JSON.stringify(error, null, 2));
// Fallback to base64 if Cloudinary fails
const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
console.log("Using base64 fallback");
resolve(base64);

}
else{

console.log("Cloudinary Upload Success:", result.secure_url);
resolve(result.secure_url);

}

}

);


streamifier
.createReadStream(file.buffer)
.pipe(stream);


});

};




// CREATE POST

exports.createPost = async(req,res)=>{

try{


console.log("Request body:", req.body);
console.log("Request files:", req.files);

let imageUrls=[];



// Upload Images to Cloudinary

if(req.files && req.files.length > 0){

console.log("Files received:", req.files.length);

for(const file of req.files){

console.log("Uploading file to Cloudinary:", file.originalname);
console.log("File details:", {
  originalname: file.originalname,
  mimetype: file.mimetype,
  size: file.size,
  buffer: file.buffer ? "Has buffer" : "No buffer"
});

try{
const url = await uploadToCloudinary(file);
console.log("Upload successful, URL:", url);
if (url) { // Only add if upload was successful
imageUrls.push(url);
}
}
catch(uploadError){
console.log("Image upload failed for one file:", uploadError);
// Continue with other images even if one fails
}


}

}
else{
console.log("No files received - req.files is:", req.files);
console.log("Request content-type:", typeof req.get === 'function' ? req.get('content-type') : req.headers?.['content-type']);
}



// Validate required fields

if(
!req.body.title ||
!req.body.description ||
!req.body.author ||
!req.body.authorName
){

return res.status(400).json({

success:false,

message:"Required fields missing: title, description, author, authorName"

});

}



// Check if user is verified traveler
const Customer = require("../models/customer");
const user = await Customer.findById(req.body.author);

if(!user || !user.isVerifiedTraveler){
return res.status(403).json({

success:false,

message:"Only verified travelers can create posts. Please complete at least one booking to become verified."

});

}



const post = await Post.create({

title:req.body.title,

description:req.body.description,

route:req.body.route || "",

destination:req.body.destination || "",

images:imageUrls,

author:req.body.author,

authorName:req.body.authorName,

authorProfile:req.body.authorProfile || ""

});

console.log("Post created with images:", post.images);
console.log("Post created successfully with ID:", post._id);

// Update user's total posts count
await Customer.findByIdAndUpdate(req.body.author, {
$inc: { totalPosts: 1 }
});





res.status(201).json({

success:true,

message:"Post created successfully 🎉",

post

});



}
catch(err){


console.log("CREATE POST ERROR:",err);


res.status(500).json({

success:false,

message:err.message || "Failed to create post"

});


}


};







// GET POSTS

exports.getPosts = async (req, res) => {

  try {

    const posts = await Post.find({ status: "active" }).sort({ createdAt: -1 });

    res.status(200).json({

      success: true,

      posts

    });

  }
  catch (err) {

    console.log("GET POSTS ERROR:", err);

    res.status(500).json({

      success: false,

      message: err.message || "Failed to get posts"

    });

  }

};



// GET ALL POSTS (for admin)

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      posts
    });
  } catch (err) {
    console.log("GET ALL POSTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to get all posts"
    });
  }
};



// GET TRENDING POSTS

exports.getTrendingPosts = async(req,res)=>{

try{


const posts = await Post.find({status:"active"}).sort({createdAt:-1});


const postsWithScore = posts.map(post=>({

...post.toObject(),

engagementScore: (post.likes || 0) * 2 + (post.comments || 0) * 1


}));


postsWithScore.sort((a,b)=>b.engagementScore - a.engagementScore);


const trendingPosts = postsWithScore.slice(0, 10);


res.status(200).json({

success:true,

posts:trendingPosts

});



}
catch(err){


console.log("GET TRENDING POSTS ERROR:",err);


res.status(500).json({

success:false,

message:err.message || "Failed to fetch trending posts"

});


}


};



// DELETE POST

exports.deletePost = async(req,res)=>{


try{


const post = await Post.findById(req.params.id);



if(!post){

return res.status(404).json({

success:false,

message:"Post not found"

});

}




await Post.findByIdAndDelete(req.params.id);



await Report.deleteMany({

postId:req.params.id

});




res.json({

success:true,

message:"Post deleted successfully"

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};







// HIDE / UNHIDE POST


exports.updatePostStatus = async(req,res)=>{


try{


const post = await Post.findById(req.params.id);



if(!post){


return res.status(404).json({

success:false,

message:"Post not found"

});


}




post.status =
post.status === "active"
?
"hidden"
:
"active";




await post.save();




res.json({

success:true,

message:"Post status updated successfully",

status:post.status,

post

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};







// UPDATE POST


exports.updatePost = async(req,res)=>{


try{


const updateData={};



// only update available fields


if(req.body.title)
updateData.title=req.body.title;


if(req.body.description)
updateData.description=req.body.description;


if(req.body.route)
updateData.route=req.body.route;


if(req.body.destination)
updateData.destination=req.body.destination;


if(req.body.status)
updateData.status=req.body.status;





const post = await Post.findByIdAndUpdate(

req.params.id,

updateData,

{
new:true,
runValidators:true
}

);





if(!post){


return res.status(404).json({

success:false,

message:"Post not found"

});


}





res.json({

success:true,

message:"Post updated successfully",

post

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};


// PIN / UNPIN POST


exports.pinPost = async(req,res)=>{


try{


const post = await Post.findById(req.params.id);



if(!post){


return res.status(404).json({

success:false,

message:"Post not found"

});

}



post.isPinned = !post.isPinned;

await post.save();



res.json({

success:true,

message:post.isPinned ? "Post pinned successfully 📌" : "Post unpinned successfully",

post

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};



// LIKE POST


exports.likePost = async(req,res)=>{


try{


const post = await Post.findById(req.params.id);



if(!post){


return res.status(404).json({

success:false,

message:"Post not found"

});

}



post.likes += 1;

await post.save();



res.json({

success:true,

message:"Post liked successfully ❤️",

post

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};



// ADD COMMENT


exports.addComment = async(req,res)=>{


try{


const post = await Post.findById(req.params.id);



if(!post){


return res.status(404).json({

success:false,

message:"Post not found"

});

}



if(!req.body.text || !req.body.authorName){


return res.status(400).json({

success:false,

message:"Comment text and author name are required"

});

}



post.comments += 1;

await post.save();



res.json({

success:true,

message:"Comment added successfully 💬",

post

});



}
catch(err){


res.status(500).json({

success:false,

message:err.message

});


}


};