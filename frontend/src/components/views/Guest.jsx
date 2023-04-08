import React, { useEffect, useState } from "react";
import axios from "axios";

function Guest() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get("http://localhost:8080/items");
      setItems(response.data);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:8080/users");
      const users = response.data.reduce((obj, user) => {
        obj[user.id] = user;
        return obj;
      }, {});
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`/items/${id}`);
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <ul>
      {items.map((item) => (
        <ul key={item.id}>
          <div><strong>Username: </strong><br/> {users[item.user_id]?.username}</div>
          <div> <strong>Item Name: </strong><br/>  {item.item_name}</div>
          <div><strong>Description: </strong><br/> {item.description}</div>
          <div><strong>Quantity: </strong><br/> {item.quantity} <hr/></div>
        </ul>
      ))}
    </ul>
  );
}

export default Guest;
