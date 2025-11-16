const Models = {
  QWEN3_VL: 'qwen3-vl:235b-cloud',
  QWEN3_CODER: 'qwen3-coder:480b-cloud'
};

async function callOllama(prompt, model) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Prompt must be a non-empty string');
  }

  if (!model || !Object.values(Models).includes(model)) {
    throw new Error(`Invalid model. Use one of the following: ${Object.values(Models).join(', ')}`);
  }

  console.log(`Calling Ollama with prompt: "${prompt}" and model: "${model}"`);

  return `Response from ${model}: This is a placeholder response for prompt "${prompt}"`;
}

module.exports = {
  callOllama,
  Models
};