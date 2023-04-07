const knex = require("./dbConnection");

const getUsers = () => {
  return knex.select().from("users");
}

const getItems = () => {
  return knex.select().from("items");
}

const getItemsbyUser = async (userId) => {
  const items = await Item.find({ user_id: userId });
  return items;
}

const getUsersById = (id) => {
  return knex.select().from('users').where({ id: id }).first();
}

const getItemById = (id) => {
  return knex.select().from('items').where({ id: id }).first();
}

const createUser = async (first_name, last_name, username, password) => {
  const newUser = {
    first_name, 
    last_name, 
    username,
    password,
  };
  const result = await knex('users').insert(newUser);
  return result[0];
};

const postUser = (user) => {
  return knex("customers").insert(user);
};

const createItem = async (user_id, item_name, description, quantity) => {
  const newItem = {
    user_id,
    item_name,
    description,
    quantity,
  };
  const result = await knex('items').insert(newItem);
  return result[0];
};

const updateItem = async (id, user_id, item_name, description, quantity) => {
  const updatedItem = {
    user_id,
    item_name, 
    description,
    quantity,
  };
  await knex('items').where({id: id}).update(updatedItem);
  return updatedItem;
};


const deleteItem = async (id) => {
  const result = await knex('items').where({ id: id}).del();
  return result > 0 ? true: false;
}

const getUsersLogin = () => {
  return knex.select("*").from("users");
};

const getUsersInfo = () => {
  return knex.select("*").from("users");
};

const getUser = (username) => {
  return knex.select("*").from("users").where({ username: username });
};

module.exports = {
  getUsers,
  getItems,
  getUsersById,
  getItemById,
  createItem,
  createUser,
  updateItem, 
  deleteItem, 
  getUsersLogin,
  getUsersInfo,
  postUser,
  getItemsbyUser,
  getUser,
};
