const express = require('express');
const path = require('path');
const { callOllama } = require('../utils/callOllama');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/callOllama', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await callOllama(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;