const express = require('express');
const path = require('path');
const { callOllama } = require('../utils/callOllama');
const { readMemory, writeMemory, savePattern } = require('../utils/memory_utils');
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
    const memory = await readMemory();
    const validatedPattern = memory.patterns.find(p => p.input === prompt && p.validated);

    if (validatedPattern) {
      res.json({ response: validatedPattern.output, fromMemory: true });
    } else {
      const response = await callOllama(prompt);
      await savePattern(prompt, response);
      res.json({ response, fromMemory: false });
    }
  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/patterns', async (req, res) => {
  try {
    const memory = await readMemory();
    res.json(memory.patterns);
  } catch (error) {
    console.error('Error reading memory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/patterns/validate', async (req, res) => {
  const { timestamp } = req.body;
  try {
    const memory = await readMemory();
    const pattern = memory.patterns.find(p => p.timestamp === timestamp);
    if (pattern) {
      pattern.validated = true;
      await writeMemory(memory);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Pattern not found' });
    }
  } catch (error) {
    console.error('Error validating pattern:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;