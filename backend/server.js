const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRoute = require('./routes/notes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.send('✅ API is working');
});

// Notes API route
app.use('/api/notes', notesRoute);

// Connect to MongoDB and start the server
mongoose.connect('mongodb://localhost:27017/notesapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});
