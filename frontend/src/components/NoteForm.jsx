import React, { useState } from 'react';

const NoteForm = ({ refreshNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create note');
      }

      setTitle('');
      setContent('');
      refreshNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form">
      <h2 className="form-title">Create New Note</h2>
      
      {error && <div className="message error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            maxLength={100}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            className="form-input form-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            maxLength={1000}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="form-button"
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
};

export default NoteForm; 