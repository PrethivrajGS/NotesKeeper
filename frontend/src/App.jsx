import React, { useEffect, useState } from 'react';
import NoteForm from './components/NoteForm.jsx';
import NoteList from './components/NoteList.jsx';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    const res = await fetch('http://localhost:5000/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div>
      <h1>Notes Keeper</h1>
      <NoteForm refreshNotes={getNotes} />
      <NoteList notes={notes} refreshNotes={getNotes} />
    </div>
  );
};

export default App;

