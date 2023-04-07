const express = require('express');
const knexConfig = require('./knexfile')[process.env.NODE_ENV || 'development'];
const env = process.env.NODE_ENV || 'development'
const knex = require('knex')(knexConfig);
const morgan = require("morgan");
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const { getUsers, getUsersById,  deleteItem, getItemsbyUser } = require('./db/controllers');
const { getItems, getItemById, createItem, updateItem, getUser } = require('./db/controllers');
const { authenticateToken, comparePasswords, } = require("./utilities/authorization");
const app = express();
const port = process.env.PORT || 8081;

// Middleware
app.use(morgan("tiny"));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cookieSession({
  name: 'user_session',
  httpOnly: true,
  sameSite: 'strict',
  secret: 'somethingsecretiwouldthink'
}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


const passHasher = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

const hashCompare = async (inputPassword, storedHash) => {
  try{
    let doesMatch = bcrypt.compareSync(inputPassword, storedHash)
    return doesMatch
  }
  catch(err){
    throw 'There was a problem with your username or password.'
  }
}

const getUserID = async (username) => {
  try{
    let userID = await knex('users')
    .select('id')
    .where('username', '=', `${username}`)
    .then(rows => {
      if (rows.length === 0) {
        throw 'User not found.';
      }
      return rows[0].id;
    });
    return userID
  }
  catch(err){
    throw err
  }
}

const retrievePass = async (username) => {
  let hash
  try {
    hash = await knex('users')
    .select('password').where('username', '=', `${username}`)
    .then(array => array[0].password)
    .catch(err => {
      // console.log(err)
      throw 'No password found.'
    })
  }
  catch(err) {
    // console.log(err)
    return err
  }
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

app.get('/Login', (req, res) => {
  res.status(200).send('This is the login page.');
});

app.post('/Login', async (req, res) => {
  const { body } = req;
  try {
    let storedPass = await retrievePass(body.username);
    let doesMatch = await hashCompare(body.password, storedPass)
    if(doesMatch){
      req.session.username = req.body.username;
      res.status(202).json('Authenticated')
    }else{
      res.status(404).json('There was a problem with your username or password.')
    }
  }
  catch(err){
    // console.log(err);
    res.json(err)
  }
})

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

app.get('/userItems/:username', async (req, res) => {
  console.log(req.headers);
  try {
    const userId = req.params.id;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.error(err);
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        const items = await getItemsbyUser(decodedToken.id);
        res.status(200).json(items);
      }
    });
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
  const { body } = req;
  const quantity = parseInt(body.quantity)
  try {
    let userID = await getUserID(body.username)
    let newItem = await knex('items')
      .insert({user_id:`${userID}`, item_name: `${body.itemname}`, description: `${body.description}`, quantity: `${quantity}`}, 'id')
      .then(id => {
        res.status(201).json('Item creation successful.')
      })
  }
  catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})

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
