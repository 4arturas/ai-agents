const fs = require('fs').promises;
const path = require('path');

const MEMORY_FILE = path.join(__dirname, '..', 'project_memory.json');

async function readMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default structure
      return { history: [], patterns: [] };
    }
    throw error;
  }
}

async function writeMemory(data) {
  await fs.writeFile(MEMORY_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function savePattern(input, output) {
  const memory = await readMemory();
  memory.patterns.push({
    input,
    output,
    validated: false,
    timestamp: new Date().toISOString(),
  });
  await writeMemory(memory);
}

module.exports = {
  readMemory,
  writeMemory,
  savePattern,
};
