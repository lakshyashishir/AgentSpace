const { randomUUID } = require("crypto");
const express = require("express");
const router = express.Router();

router.get("/profile/:id", async (req, res) => {
    const userId = req.params.id;
  
    const { data, error } = await req.supabase.from("profiles").select("*").eq("id", userId).single();
  
    // if (error) return res.status(400).json({ error: error.message });
    if (!data) return res.status(204).send();
    return res.json(data);
  });
  

router.put("/profile", async (req, res) => {
  const userId = req.headers["user-id"];
  const { username, avatar_url } = req.body;

  const { data, error } = await req.supabase
    .from("profiles")
    .update({ username, avatar_url, updated_at: new Date() })
    .eq("id", userId);

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

router.post("/profile", async (req, res) => {
  const { username, address } = req.body;
  const id = randomUUID();
  console.log("Creating profile with id:", id);

  const { data, error } = await req.supabase
    .from("profiles")
    .insert({ id ,username, address, updated_at: new Date() });

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
});

module.exports = router;
