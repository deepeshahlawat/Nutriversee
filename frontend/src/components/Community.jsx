import React, { useState, useEffect } from "react";
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

  const [newCaption, setNewCaption] = useState("");
  const [file, setFile] = useState(null);

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