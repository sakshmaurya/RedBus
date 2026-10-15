import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Community.css";
import { useTranslation } from "react-i18next";

const Community = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentCustomer =
    JSON.parse(localStorage.getItem("user")) || {};


  const [form, setForm] = useState({
    title: "",
    description: "",
    route: "",
    destination: ""
  });


  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});



  // Input Change

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };



  // Image Select

  const handleImageChange = (e) => {

    setImages([
      ...e.target.files
    ]);

  };



  // Get Posts

  const fetchPosts = async () => {

    try{

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts`
      );

      console.log("Posts received:", res.data.posts);
      setPosts(
        res.data.posts || []
      );


    }
    catch(err){

      console.log("Error fetching posts:", err);

    }

  };



  useEffect(()=>{

    fetchPosts();

  },[]);





  // Create Post

  const createPost = async()=>{


    // Check if user is logged in
    if(!currentCustomer || !currentCustomer._id){
      alert("Please login to create a post");
      navigate("/login");
      return;
    }

    // Validation
    if(!form.title || form.title.trim().length < 3){
      setError("Please enter a title (at least 3 characters)");
      return;
    }
    if(!form.description || form.description.trim().length < 10){
      setError("Please enter a description (at least 10 characters)");
      return;
    }

    setLoading(true);
    setError("");

    try{


      const data = new FormData();


      data.append(
        "title",
        form.title
      );


      data.append(
        "description",
        form.description
      );


      data.append(
        "route",
        form.route
      );


      data.append(
        "destination",
        form.destination
      );



      data.append(
        "author",
        currentCustomer._id
      );


      data.append(
        "authorName",
        currentCustomer.name
      );


      data.append(
        "authorProfile",
        currentCustomer.profilePicture || ""
      );



      images.forEach((image)=>{

        data.append(
          "images",
          image
        );

      });





      await axios.post(

        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts`,

        data,

        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }

      );



      setLoading(false);
      alert(
        "Post Created Successfully 🎉"
      );


      setForm({

        title:"",
        description:"",
        route:"",
        destination:""

      });



      setImages([]);




      fetchPosts();



    }
    catch(err){

      setLoading(false);
      const errorMessage = err.response?.data?.message || err.message || "Error creating post. Please try again.";
      setError(errorMessage);
      alert(errorMessage);

    }


  };






  // Like Post

  const likePost = async(id)=>{


    // Check if user is logged in
    if(!currentCustomer || !currentCustomer._id){
      alert("Please login to like a post");
      navigate("/login");
      return;
    }

    try{


      await axios.post(

        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${id}/like`

      );


      fetchPosts();


    }
    catch(err){

      alert("Error liking post");

    }


  };






  // Report Post

  const reportPost = async(postId)=>{


    // Check if user is logged in
    if(!currentCustomer || !currentCustomer._id){
      alert("Please login to report a post");
      navigate("/login");
      return;
    }

    try{


      await axios.post(

        `${process.env.REACT_APP_BACKEND_URL}/v1/api/report`,

        {

          postId,

          reportedBy:currentCustomer._id,

          reason:"Inappropriate Content"

        }

      );


      alert(
        "Post Reported Successfully 🚩"
      );


    }
    catch(err){

      alert(
        "Error reporting post"
      );

    }


  };






  // Fetch Comments

  const fetchComments = async(postId)=>{


    try{


      const res = await axios.get(

        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${postId}/comments`

      );



      setComments({

        ...comments,

        [postId]:res.data.comments || []

      });



    }
    catch(err){

    }


  };







  // Add Comment

  const addComment = async(postId)=>{


    // Check if user is logged in
    if(!currentCustomer || !currentCustomer._id){
      alert("Please login to comment on a post");
      navigate("/login");
      return;
    }

    if(!commentText[postId]) return;



    try{


      await axios.post(

        `${process.env.REACT_APP_BACKEND_URL}/v1/api/posts/${postId}/comment`,

        {

          postId,

          author:currentCustomer._id,

          authorName:currentCustomer.name,

          text:commentText[postId]

        }

      );



      setCommentText({

        ...commentText,

        [postId]:""

      });



      fetchComments(postId);


    }
    catch(err){

      alert("Error adding comment");

    }


  };




  // Share Post
  const sharePost = async(post) => {
    const shareUrl = `${window.location.origin}/community?post=${post._id}`;
    const shareText = `Check out this travel post: ${post.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  // Share on WhatsApp
  const shareOnWhatsApp = (post) => {
    const shareUrl = `${window.location.origin}/community?post=${post._id}`;
    const shareText = encodeURIComponent(`Check out this travel post: ${post.title} ${shareUrl}`);
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  };

  // Share on Facebook
  const shareOnFacebook = (post) => {
    const shareUrl = `${window.location.origin}/community?post=${post._id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  // Share on Twitter / X
  const shareOnTwitter = (post) => {
    const shareUrl = `${window.location.origin}/community?post=${post._id}`;
    const shareText = encodeURIComponent(`Check out this travel post on RedBus: "${post.title}" 🚌 ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, "_blank");
  };






  return (

    <div className="community">


      <h1>
        🚍 {t('community.travelCommunity')}
      </h1>



      <div className="createPost">

        {error && (
          <div style={{
            color: "#d84e55",
            backgroundColor: "#ffebee",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <input

          type="text"

          name="title"

          placeholder={t('community.postTitle')}

          value={form.title}

          onChange={handleChange}

          disabled={loading}
        />



        <textarea

          name="description"

          placeholder={t('community.shareExperience')}

          value={form.description}

          onChange={handleChange}

          disabled={loading}
        />



        <input

          type="text"

          name="route"

          placeholder={t('community.routePlaceholder') || "Route (e.g. Mumbai to Pune)"}

          value={form.route}

          onChange={handleChange}

          disabled={loading}
        />



        <input

          type="text"

          name="destination"

          placeholder={t('community.destinationPlaceholder') || "Destination (e.g. Pune)"}

          value={form.destination}

          onChange={handleChange}

          disabled={loading}
        />



        <input

          type="file"

          multiple

          onChange={handleImageChange}

          disabled={loading}
          accept="image/*"
        />

        {images.length > 0 && (
          <div style={{ margin: "10px 0", fontSize: "14px" }}>
            {images.length} {t('community.uploadImages')}
          </div>
        )}



        <button onClick={createPost} disabled={loading}>

          {loading ? t('common.loading') : t('community.createPost')}

        </button>



      </div>




      <h2>
        Recent Travel Posts
      </h2>



    {
      posts.map((post)=>(


        <div
          className="postCard"
          key={post._id}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            margin: "0 auto 20px auto"
          }}
        >


          {/* Post Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
            paddingBottom: "15px",
            borderBottom: "1px solid #e0e0e0"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#d84e55",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "20px",
              fontWeight: "bold",
              marginRight: "15px"
            }}>
              {post.authorName ? post.authorName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h4 style={{
                margin: "0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#333"
              }}>
                {post.authorName}
              </h4>
              <p style={{
                margin: "0",
                fontSize: "12px",
                color: "#888"
              }}>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>


          {/* Post Title */}
          <h3 style={{
            margin: "0 0 10px 0",
            fontSize: "22px",
            fontWeight: "700",
            color: "#333"
          }}>
            {post.title}
          </h3>


          {/* Post Description */}
          <p style={{
            margin: "0 0 15px 0",
            fontSize: "15px",
            color: "#555",
            lineHeight: "1.6"
          }}>
            {post.description}
          </p>


          {/* Route and Destination */}
          {(post.route || post.destination) && (
            <div style={{
              display: "flex",
              gap: "15px",
              marginBottom: "15px",
              fontSize: "14px",
              color: "#666"
            }}>
              {post.route && (
                <span>
                  <strong>🚌 {t('community.postTitle')}:</strong> {post.route}
                </span>
              )}
              {post.destination && (
                <span>
                  <strong>📍 {t('community.postDescription')}:</strong> {post.destination}
                </span>
              )}
            </div>
          )}


          {/* Images Grid */}
          {post.images && post.images.length > 0 && (
            <div>
              <div style={{
                display: "grid",
                gridTemplateColumns: post.images.length === 1 ? "1fr" : post.images.length === 2 ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "15px"
              }}>
                {post.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="travel"
                    onError={(e) => {
                      console.log("Image load error:", img, e);
                      e.target.style.display = 'none';
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully:", img);
                    }}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            paddingTop: "15px",
            borderTop: "1px solid #e0e0e0",
            flexWrap: "wrap"
          }}>
            <button
              onClick={()=>likePost(post._id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #d84e55",
                color: "#d84e55",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#d84e55"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#d84e55"}
            >
              ❤️ {post.likes || 0}
            </button>

            <button
              onClick={()=>reportPost(post._id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #ff6b6b",
                color: "#ff6b6b",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#ff6b6b"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#ff6b6b"}
            >
              🚩 {t('common.delete')}
            </button>

            <button
              onClick={()=>sharePost(post)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #4CAF50",
                color: "#4CAF50",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#4CAF50"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#4CAF50"}
            >
              📤 {t('community.share')}
            </button>

            <button
              onClick={()=>shareOnWhatsApp(post)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #25D366",
                color: "#25D366",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#25D366"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#25D366"}
            >
              💬 WhatsApp
            </button>

            <button
              onClick={()=>shareOnFacebook(post)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #1877F2",
                color: "#1877F2",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#1877F2"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
              onMouseEnter={(e) => e.target.style.color = "#fff"}
              onMouseLeave={(e) => e.target.style.color = "#1877F2"}
            >
              📘 Facebook
            </button>

            <button
              onClick={()=>shareOnTwitter(post)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fff",
                border: "1px solid #000",
                color: "#000",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = "#000"; e.target.style.color = "#fff"; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = "#fff"; e.target.style.color = "#000"; }}
            >
              𝕏 Twitter
            </button>
          </div>


          {/* Comment Section */}
          <div style={{
            borderTop: "1px solid #e0e0e0",
            paddingTop: "15px"
          }}>
            <div style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px"
            }}>
              <input
                placeholder="Write a comment..."
                value={commentText[post._id] || ""}
                onChange={(e)=>
                  setCommentText({
                    ...commentText,
                    [post._id]:e.target.value
                  })
                }
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "20px",
                  fontSize: "14px"
                }}
              />
              <button
                onClick={()=>addComment(post._id)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#d84e55",
                  border: "none",
                  color: "#fff",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                Post
              </button>
            </div>

            <button
              onClick={()=>fetchComments(post._id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f5f5f5",
                border: "none",
                color: "#666",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px",
                marginBottom: "15px"
              }}
            >
              View Comments ({comments[post._id]?.length || 0})
            </button>


            {/* Comments List */}
            {comments[post._id] && comments[post._id].length > 0 && (
              <div style={{
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                padding: "10px"
              }}>
                {comments[post._id].map((c)=>(
                  <div key={c._id} style={{
                    padding: "10px",
                    borderBottom: "1px solid #e0e0e0",
                    marginBottom: "5px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px"
                    }}>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor: "#666",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "bold",
                        marginRight: "10px"
                      }}>
                        {c.authorName ? c.authorName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <b style={{
                        fontSize: "14px",
                        color: "#333"
                      }}>
                        {c.authorName}
                      </b>
                    </div>
                    <p style={{
                      margin: "0",
                      fontSize: "14px",
                      color: "#555",
                      marginLeft: "40px"
                    }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      ))
    }



    </div>

  );


};


export default Community;