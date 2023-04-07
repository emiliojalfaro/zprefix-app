const express = require('express');
const knexConfig = require('./knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { getUsers, getUsersById,  deleteItem, postUser } = require('./db/controllers');
const { getItems, getItemById, createItem, updateItem } = require('./db/controllers');
const { authenticateToken, comparePasswords, } = require("./utilities/authorization");
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passHasher = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Login', async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users')
    .where('username', username)
    .first();
  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  } else {
    res.status(401).json({ message: 'Invalid login' });
  }
});


app.get("/usersPublic", authenticateToken, (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    getUserPublicInfo(user.name).then((data) => res.json(data));
  });
});

app.get("/authUsers", authenticateToken, (req, res) => {
  getUsers().then((data) => res.json(data));
});

app.post('/CreateAccount', async (req, res) => {
  const { body } = req;
  const hashedPass = await passHasher(body.password)
  try {
    let newUser = await knex('users')
    .insert({first_name: `${body.firstName}`, last_name: `${body.lastName}`, username: `${body.username}`, password: `${hashedPass}`}, 'id')
    .then(id => {
        res.status(201).json('User creation successful. Please log in.')
      })
  }
  catch(err){
    res.status(400).json('There was an error processing your request.')
  }
})

// Routes

app.get('/', (req, res) => {
  res.status(200).send('API is up and running.');
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
