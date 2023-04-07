const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('users').del();

  const users = [
    { first_name: 'John', last_name: 'Doe', username: 'johndoe', password: 'password1' },
    { first_name: 'Jane', last_name: 'Doe', username: 'janedoe', password: 'password2' },
    { first_name: 'Bob', last_name: 'Smith', username: 'bobsmith', password: 'password3' },
    { first_name: 'Alice', last_name: 'Jones', username: 'alicejones', password: 'password4' },
    { first_name: 'Mike', last_name: 'Davis', username: 'mikedavis', password: 'password5' },
    { first_name: 'Sarah', last_name: 'Johnson', username: 'sarahjohnson', password: 'password6' },
    { first_name: 'David', last_name: 'Lee', username: 'davidlee', password: 'password7' },
    { first_name: 'Emily', last_name: 'Brown', username: 'emilybrown', password: 'password8' },
    { first_name: 'Tom', last_name: 'Wilson', username: 'tomwilson', password: 'password9' },
    { first_name: 'Amy', last_name: 'Taylor', username: 'amytaylor', password: 'password10' }
  ];

  const usersWithHashedPasswords = await Promise.all(
    users.map(async user => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword
      };
    })
  );

  await knex('users').insert(usersWithHashedPasswords);
};
