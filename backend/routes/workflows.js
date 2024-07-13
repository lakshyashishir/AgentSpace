const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, name, description, content } = req.body;

  const { data, error } = await req.supabase.from("workflows").insert([{ user_id, name, description, content }]);
  if (error) return res.status(400).json({ error: error.message });
  return res.status(201).json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await req.supabase.from("workflows").select("*").eq("id", id).single();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Workflow not found" });
  return res.json(data);
});

router.get("/", async (req, res) => {
  const { user_id } = req.query;
  let query = req.supabase.from("workflows").select("*");
  if (user_id) query = query.eq("user_id", user_id);
  const { data, error } = await query;

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, content } = req.body;

  const { data, error } = await req.supabase.from("workflows").update({ name, description, content }).eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await req.supabase.from("workflows").delete().eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: "Workflow deleted successfully" });
});

module.exports = router;
