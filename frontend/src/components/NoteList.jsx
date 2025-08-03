import React, { useState } from 'react';

const NoteList = ({ notes, refreshNotes }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: editTitle.trim(), 
          content: editContent.trim() 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update note');
      }

      setEditingId(null);
      setEditTitle('');
      setEditContent('');
      refreshNotes();
    } catch (err) {
      console.error('Error updating note:', err);
      alert('Failed to update note: ' + err.message);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        throw new Error('Failed to delete note');
      }

      refreshNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      alert('Failed to delete note: ' + err.message);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="notes-container">
      {notes.map((note) => (
        <div key={note._id} className="note-card">
          {editingId === note._id ? (
            <div>
              <input
                type="text"
                className="form-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                maxLength={100}
              />
              <textarea
                className="form-input form-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Content"
                maxLength={1000}
              />
              <div className="note-actions">
                <button
                  className="action-button edit-button"
                  onClick={() => saveEdit(note._id)}
                  disabled={loading[note._id]}
                >
                  {loading[note._id] ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="action-button delete-button"
                  onClick={cancelEdit}
                  disabled={loading[note._id]}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="note-title">{note.title}</h3>
              <p className="note-content">{note.content}</p>
              <div className="note-meta">
                <span className="note-date">
                  {formatDate(note.createdAt)}
                </span>
                <div className="note-actions">
                  <button
                    className="action-button edit-button"
                    onClick={() => startEdit(note)}
                    disabled={loading[note._id]}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete-button"
                    onClick={() => deleteNote(note._id)}
                    disabled={loading[note._id]}
                  >
                    {loading[note._id] ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList; 