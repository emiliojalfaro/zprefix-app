import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../Config';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    item_name: '',
    description: '',
    quantity: 0,
    user_id: 0 
  });
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!Number.isInteger(parseInt(formData.quantity))) {
      alert('Quantity must be a valid integer.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiUrl}/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate('/items');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      alert(`Error creating item: ${error.message}`);
    }
  };
  
  return (
    <div>
      <h1>Create Item</h1>
      <form onSubmit={handleSubmit}>
      <label>
          Username:
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Item Name:
          <input
            type='text'
            name='item_name'
            value={formData.item_name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <input
            type='text'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Quantity:
          <input
            type='number'
            name='quantity'
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </label>
        <label>
          User ID:
          <input
            type='number'
            name='user_id'
            value={formData.user_id}
            onChange={handleInputChange}
          />
        </label>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default CreateItem;
