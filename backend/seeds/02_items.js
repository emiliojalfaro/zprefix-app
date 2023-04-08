/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('items').del()
  await knex('items').insert([
    {  user_id: 1, item_name: 'The Great Gatsby', description: 'A classic novel by F. Scott Fitzgerald', quantity: 3},
    {  user_id: 1, item_name: 'To Kill a Mockingbird', description: 'A Pulitzer Prize-winning novel by Harper Lee', quantity: 2},
    {  user_id: 2, item_name: 'The Catcher in the Rye', description: 'A novel by J. D. Salinger', quantity: 1},
    {  user_id: 2, item_name: '1984', description: 'A dystopian novel by George Orwell', quantity: 4},
    {  user_id: 3, item_name: 'Pride and Prejudice', description: 'A romantic novel by Jane Austen', quantity: 2},
    {  user_id: 3, item_name: 'Sense and Sensibility', description: 'A novel by Jane Austen', quantity: 1},
    {  user_id: 4, item_name: 'The Hobbit', description: 'A fantasy novel by J. R. R. Tolkien', quantity: 3},
    {  user_id: 4, item_name: 'The Lord of the Rings', description: 'A trilogy of fantasy novels by J. R. R. Tolkien', quantity: 1},
    {  user_id: 5, item_name: 'Brave New World', description: 'A novel by Aldous Huxley', quantity: 2},
    {  user_id: 5, item_name: 'Animal Farm', description: 'A novella by George Orwell', quantity: 3},
    {  user_id: 6, item_name: 'One Hundred Years of Solitude', description: 'A novel by Gabriel García Márquez', quantity: 1},
    {  user_id: 6, item_name: 'Love in the Time of Cholera', description: 'A novel by Gabriel García Márquez', quantity: 2},
    {  user_id: 7, item_name: 'The Picture of Dorian Gray', description: 'A novel by Oscar Wilde', quantity: 1},
    {  user_id: 7, item_name: 'The Importance of Being Earnest', description: 'A play by Oscar Wilde', quantity: 2},
    {  user_id: 8, item_name: 'The Adventures of Tom Sawyer', description: 'A novel by Mark Twain', quantity: 3},
    {  user_id: 8, item_name: 'Adventures of Huckleberry Finn', description: 'A novel by Mark Twain', quantity: 1},
    {  user_id: 9, item_name: 'The Odyssey', description: 'An epic poem by Homer', quantity: 2},
    {  user_id: 9, item_name: 'The Iliad', description: 'An ancient Greek epic poem by Homer', quantity: 1},
    {  user_id: 10, item_name: 'Hamlet', description: 'A tragedy by William Shakespeare', quantity: 1},
    {  user_id: 10, item_name: "The Da Vinci Code", description: "A mystery thriller novel by Dan Brown", quantity: 2},
  ]);
};
