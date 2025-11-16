const fetch = require('node-fetch');

const Models = {
  QWEN3_VL: 'qwen3-vl:235b-cloud',
  QWEN3_CODER: 'qwen3-coder:480b-cloud'
};

async function callOllama(prompt) {
  const model = Models.QWEN3_VL;
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  console.log(`Calling Ollama with prompt: "${prompt}" and model: "${model}"`);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw error;
  }
}

module.exports = {
  callOllama,
  Models
};