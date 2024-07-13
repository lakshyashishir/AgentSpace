const express = require('express');
const router = express.Router();

router.get('/profile', async (req, res) => {
  const userId = req.headers['user-id']; 

  const { data, error } = await req.supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'User not found' });
  return res.json(data);
});

router.put('/profile', async (req, res) => {
  const userId = req.headers['user-id']; 
  const { username, avatar_url } = req.body;

  const { data, error } = await req.supabase
    .from('profiles')
    .update({ username, avatar_url, updated_at: new Date() })
    .eq('id', userId);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

module.exports = router;