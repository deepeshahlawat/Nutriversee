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
        image: "https://integrishealth.org/-/media/blog/18-april/bowls-of-superfood-fruits-and-vegetables.ashx?revision=745f638c-d9a3-4a85-8963-9436f6b71e19",
        caption: "The Power of Superfoods: How to Boost Your Health Naturally",
        liked: false,
        comments: [],
      },
      {
        id: 2,
        author: "fitnessguru",
        location: "Mumbai, India",
        image: "https://thumbs.dreamstime.com/b/business-inspirational-motivational-quote-consistency-key-keep-going-sunset-sunrise-color-background-beach-smooth-246444086.jpg",
        caption: "Consistency is key! 💪 Keep pushing yourself every day!",
        liked: false,
        comments: [],
      },
      {
        id: 3,
        author: "rakeshgupta",
        location: "Delhi, India",
        image: "https://domf5oio6qrcr.cloudfront.net/medialibrary/13856/5010c7a6-3462-4038-b34d-8b56c62ece53.jpg",
        caption: "Intermittent Fasting: Benefits, Risks, and Best Practices",
        liked: false,
        comments: [],
      },
      {
        id: 4,
        author: "fitgyan",
        location: "Jaipur, India",
        image: "https://images.squarespace-cdn.com/content/v1/5f1ea0b10b594f11008ed2fe/1645873579526-EBKJ465YEEW2KW09PCFN/unsplash-image-4_jhDO54BYg.jpg",
        caption: "Healthy Eating on a Budget: Nutritious Meals Without Breaking the Bank",
        liked: false,
        comments: [],
      },
      {
        id: 5,
        author: "roshanchhabra",
        location: "Delhi, India",
        image: "https://www.hindustantimes.com/ht-img/img/2023/06/09/1600x900/_02616c8a-adc2-11e8-82d1-388e3d6e11aa_1686300996522.jpg",
        caption: "Debunking Nutrition Myths: What Science Says About Your Diet",
        liked: false,
        comments: [],
      },
      {
        id: 6,
        author: "healthguru",
        location: " Kolkata, India",
        image: "https://granitegastro.com/wp-content/uploads/2022/09/gut-health.jpg",
        caption: "The Role of Gut Health in Overall Well-Being",
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
        author: "Deeoesh", // Default user
        location: "Delhi, India", // Default location
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
    <>
      <div className="navbar">
        <h2 className="navbar-title">Community</h2>
      </div>

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
    </>
  );
};

export default Community;