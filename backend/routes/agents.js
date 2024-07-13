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

// Execute an agent work in progrss
router.post('/execute', async (req, res) => {
  const { agent_id, input } = req.body;

  // call our AI service
  // For now, we'll just return a dummy response
  res.json({ result: `Executed agent ${agent_id} with input: ${input}` });
});

module.exports = router;