const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await req.supabase
    .from('agents')
    .select('*');

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await req.supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Agent not found' });
  return res.json(data);
});

router.post('/', async (req, res) => {
  const { name, type, description, config } = req.body;

  const { data, error } = await req.supabase
    .from('agents')
    .insert([{ name, type, description, config }]);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.post('/execute', async (req, res) => {
  const { agent_id, input, userId } = req.body;

  if (!agent_id || !input || !userId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Fetch agent details from Supabase
    // const { data: agentData, error: agentError } = await req.supabase
    //   .from('agents')
    //   .select('*')
    //   .eq('id', agent_id)
    //   .single();

    // if (agentError) throw new Error(agentError.message);
    // if (!agentData) throw new Error('Agent not found');

    const taskId = "234";

    // Emit task to Socket.IO
    req.io.emit('ai_task', {
      agent_type: "article_summarizer",
      input: "What is the capital of France?",
      user_id: userId,
      agent_config: "{}",
      task_id: taskId
    });

    console.log("1")

    // Wait for the result
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Task execution timed out'));
      }, 3000000); // 50 minutes timeout

      console.log("2")

      req.io.once(`ai_result_${taskId}`, (data) => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    res.json(result);

  } catch (error) {
    console.error('Error executing agent:', error);
    res.status(500).json({ error: 'Error executing agent: ' + error.message });
  }
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}

module.exports = router;