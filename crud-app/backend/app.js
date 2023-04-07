const express = require('express');
const knexConfig = require('./knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);
const cors = require('cors');
const { getUsers, getUsersById, createUser, deleteItem, getUsersLogin } = require('./db/controllers');
const { getItems, getItemById, createItem, updateItem } = require('./db/controllers');
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  const results = await getUsersLogin(req.body.username.toLowerCase());
  const userData = results[0];
  if (userData == null) {
    return res.status(400).json("Invalid username or password");
  }

  comparePasswords(req.body.password, userData.password).then((result) => {
    if (result) {
      const user = { name: userData.username };

      //Generates a user session ID after successful authentication.
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      console.log("passwords didnt match hash");
      return res.status(400).send();
    }
  });
});


// Routes

app.get('/', (req, res) => {
  res.status(200).send('API is up and running.');
});

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await getItems();
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUsersById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const item = await getItemById(id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await createUser(name, email);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/items', async (req, res) => {
  const { user_id, item_name, description, quantity } = req.body;
  try {
    const newItem = await knex('items').insert({
      user_id,
      item_name,
      description,
      quantity
    })
    await createItem(user_id, item_name, description, quantity);
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


app.patch('/items/:id', async (req, res) => {
  const { user_id, item_name, description, quantity } = req.body;
  const id = req.params.id;
  try {
    const updatedItem = await updateItem(id, user_id, item_name, description, quantity);
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const success = await deleteItem(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
