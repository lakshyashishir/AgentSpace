const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// const { data, error } = await supabase.auth.signUp({
//     email: "test@test.com",
//     password: "test"
// });

app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error: ' + err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));