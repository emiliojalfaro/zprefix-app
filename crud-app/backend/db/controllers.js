const knex = require("./dbConnection");



const getUsers = () => {
  return knex.select().from("users");
}

const getItems = () => {
  return knex.select().from("items");
}

const getUsersById = (id) => {
  return knex.select().from('users').where({ id: id }).first();
}

const getItemById = (id) => {
  return knex.select().from('items').where({ id: id }).first();
}

const createUser = async (first_name, last_name, username, password) => {
  return knex('users').insert({ first_name, last_name, username, password });
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

module.exports = {
  getUsers,
  getItems,
  getUsersById,
  getItemById,
  createItem,
  createUser,
  updateItem, 
  deleteItem
};
