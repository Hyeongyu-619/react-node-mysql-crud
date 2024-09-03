import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState<
    { id: number; title: string; content: string }[]
  >([]);
  const [newPostTitle, setNewPostTitle] = useState<string>("");
  const [newPostContent, setNewPostContent] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddPost = async () => {
    if (!newPostTitle || !newPostContent) return;

    try {
      const response = await axios.post("http://localhost:5000/api/posts", {
        title: newPostTitle,
        content: newPostContent,
      });
      setPosts([...posts, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleEditPost = async () => {
    if (editPostId === null || !newPostTitle || !newPostContent) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${editPostId}`,
        {
          title: newPostTitle,
          content: newPostContent,
        }
      );
      setPosts(
        posts.map((post) => (post.id === editPostId ? response.data : post))
      );
      resetForm();
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const resetForm = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setEditPostId(null);
    setIsModalOpen(false);
  };

  const openEditModal = (post: {
    id: number;
    title: string;
    content: string;
  }) => {
    setNewPostTitle(post.title);
    setNewPostContent(post.content);
    setEditPostId(post.id);
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      <div className="black-nav">
        <div className="logo">기술 Blog</div>
      </div>

      <button className="new-post-button" onClick={() => resetForm()}>
        새 글 작성
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <label>제목:</label>
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="제목"
              className="input-title"
            />
            <label>내용:</label>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="내용"
              className="input-content"
            />
            <div className="button-container">
              <button
                onClick={editPostId === null ? handleAddPost : handleEditPost}
              >
                {editPostId === null ? "작성하기" : "수정하기"}
              </button>
              <button onClick={() => setIsModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {posts.map((post) => (
        <div className="post-list" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>{new Date().toLocaleDateString()} 발행</p>
          <div className="post-buttons">
            <button onClick={() => openEditModal(post)}>수정</button>
            <button onClick={() => handleDeletePost(post.id)}>삭제</button>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
