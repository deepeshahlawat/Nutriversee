import React, { useState, useEffect} from "react";
import "../../css/Communityy.css";
import logo from "../../images/Background.png";

const Community = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // Set default posts only once
    setPosts([
      {
        id: 1,
        author: "serendipitychannie",
        location: "Delhi, India",
        image: logo,
        caption: "How to summon Hannah Bahng 🧋 I'm willing to get her a lifetime supply of matcha 😍🤭",
        liked: false,
        comments: [],
      },
      {
        id: 2,
        author: "fitnessguru",
        location: "Mumbai, India",
        image: logo,
        caption: "Consistency is key! 💪 Keep pushing yourself every day!",
        liked: false,
        comments: [],
      },
    ]);
  }, []);

  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [postText, setPostText] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [newPostText, setNewPostText] = useState("");
  const [file, setFile] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  const handleFileAttach = (event) => {
    setAttachedFile(event.target.files[0]);
  };

  const handlePost = () => {
    if (newCaption.trim() && file) {
      const newPost = {
        id: posts.length + 1,
        author: "You", // Default user
        location: "Your City", // Default location
        image: URL.createObjectURL(file), // Display uploaded image
        caption: newCaption, // Caption from input
        liked: false, // Default false
        comments: [], // Empty array
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to top
      setNewCaption(""); // Reset input
      setFile(null);
    }
  };

  const toggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const openCommentPopup = (postId) => {
    setCurrentPostId(postId);
    setShowCommentPopup(true);
  };

  const closeCommentPopup = () => {
    setShowCommentPopup(false);
  };

  const submitComment = () => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === currentPostId
          ? { ...post, comments: [...post.comments, commentText] }
          : post
      )
    );
    setCommentText("");
    closeCommentPopup();
  };

  const sharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.author,
        text: post.caption,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  return (
    <div className="community-container">
      <div className="posts-section">
        {posts.map((post) => (
          <div key={post.id} className="post-container">
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className="post-location">{post.location}</span>
            </div>
            <img src={post.image} alt="Post" className="post-image" />
            <p className="post-caption">{post.caption}</p>
            <div className="post-actions">
              <button
                className={`like-button ${post.liked ? "liked" : ""}`}
                onClick={() => toggleLike(post.id)}
              >
                ❤️ Like
              </button>
              <button className="comment-button" onClick={() => openCommentPopup(post.id)}>
                💬 Comment
              </button>
              <button className="share-button" onClick={() => sharePost(post)}>
                🔗 Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Popup */}
      {showCommentPopup && (
        <div className="comment-popup">
          <div className="popup-content">
            <h3>Add a Comment</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
            />
            <div className="popup-buttons">
              <button onClick={submitComment}>Post</button>
              <button onClick={closeCommentPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent "What do you think?" Input Bar */}
      <div className="posts-section">
        {posts.map((post) => (
          <div key={post.id} className="post-container">
            <div className="post-header">
              <span className="post-author">{post.author}</span>
              <span className="post-location">{post.location}</span>
            </div>
            <img src={post.image} alt="Post" className="post-image" />
            <p className="post-caption">{post.caption}</p>
          </div>
        ))}
      </div>

      {/* Bottom Post Bar */}
      <div className="post-bar">
        <input
          type="text"
          className="post-input"
          placeholder="Write a caption..."
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
        />

        <input
          type="file"
          id="file-input"
          className="file-input"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-input" className="file-label">➕</label>

        <button className="add-post-button" onClick={handlePost}>Post</button>
      </div>
    </div>
  );
};

export default Community;
