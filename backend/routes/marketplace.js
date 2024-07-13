const express = require('express');
const router = express.Router();

router.get('/list', async (req, res) => {
  const { data, error } = await req.supabase
    .from('marketplace_items')
    .select('*');

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.post('/create', async (req, res) => {
  const { seller_id, item_type, item_id, price } = req.body;

  const { data, error } = await req.supabase
    .from('marketplace_items')
    .insert([{ seller_id, item_type, item_id, price, status: 'active' }]);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

// Purchase an item
router.post('/purchase', async (req, res) => {
  const { item_id, buyer_id } = req.body;

  // implement the purchase logic
  // This might involve updating the item status, creating a transaction record
  // most of it can be handled with on chain data
  
  res.json({ message: `Item ${item_id} purchased by user ${buyer_id}` });
});

module.exports = router;