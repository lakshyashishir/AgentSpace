const express = require('express');
const router = express.Router();
const amqp = require('amqplib');

// Existing routes
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
    const { data: agentData, error: agentError } = await req.supabase
      .from('agents')
      .select('*')
      .eq('id', agent_id)
      .single();

    if (agentError) throw new Error(agentError.message);
    if (!agentData) throw new Error('Agent not found');

    // Connect to RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const q = await channel.assertQueue('', { exclusive: true });

    const correlationId = generateUuid();

    channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        const result = JSON.parse(msg.content.toString());
        res.json(result);
        setTimeout(() => connection.close(), 500);
      }
    }, { noAck: true });

    // Send message to AI service
    channel.sendToQueue('ai_tasks', Buffer.from(JSON.stringify({
      agent_type: agentData.type,
      input: input,
      user_id: userId,
      agent_config: agentData.config // Include any agent-specific configuration
    })), {
      correlationId: correlationId,
      replyTo: q.queue
    });

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