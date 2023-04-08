import React, { useEffect, useState } from "react";
import axios from 'axios'
import jwt_decode from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

function ItemsList({ userId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await axios.get(`http://localhost:8080/items`)
      setItems(response.data);
    };
    fetchItems();
  }, [userId]);

  const handleDelete = async (id) => {
    await axios.delete(`/items/${id}`);
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <>
      <div>
        <h1>Inventory</h1>
      </div>
      <ul>
        {items.map((item) => (
          <ul key={item.id}>
            <div>{item.item_name}</div>
            <div>{item.description}</div>
            <div>Quantity: {item.quantity}<hr/></div>
          </ul>
        ))}
      </ul>
      <Link to={`/UsersItems`}>View User Items</Link>
    </>
  );
}

export default ItemsList;
