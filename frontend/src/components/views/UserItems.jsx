import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Context from '../../Context';
import config from '../../Config';
import CreateItem from './CreateItem';
import ItemsList from './ItemsList';

const ApiUrl = config[process.env.REACT_APP_NODE_ENV || "development"].apiUrl;

const UserItems = ({ currentUser, setCurrentUser, currentItem, setCurrentItem }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  const { isSpecificitems, setIsSpecificitems, cookies = {}, resetItemDefaults } = useContext(Context);
  const [userId, setUserId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const defaultContext = {
    cookies: {},
    isSpecificitems: false,
    setIsSpecificitems: () => { },
    currentItem: null,
    setCurrentItem: () => { },
    resetItemDefaults: () => { },
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${ApiUrl}/userItems/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [username]);
  

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${ApiUrl}/users/${username}`);
        const data = await response.json();
        setUserId(data.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserId();
  }, [username]);


const updateItem = async (id, newItem) => {
  try {
    await fetch(`${ApiUrl}/items/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    });
    // update the items state to include the updated item
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, ...newItem };
      } else {
        return item;
      }
    });
    setItems(newItems);
  } catch (error) {
    console.error(error);
  }
};

const addItem = async (newItem) => {
try {
  const response = await fetch(`${ApiUrl}/items`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.token}`,
    },
    body: JSON.stringify({
      ...newItem,
      user_id: cookies.userId,
    }),
  });
  const data = await response.json();
  // update the items state to include the new item
  setItems([...items, { ...newItem, id: data[0] }]);
} catch (error) {
  console.error(error);
}
};

const deleteItem = async id => {
  try {
    await fetch(`${ApiUrl}/items/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    // remove the deleted item from the items state
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
  } catch (error) {
    console.error(error);
  }
};

const itemsRedirect = async () => {
  await setIsSpecificitems(true);
  setTimeout(() => navigate(`/items/${cookies.userId}`), 500);
};

const viewCurrentItem = async item => {
  await setCurrentItem(item);
  setTimeout(() => navigate(`/items/${item.item_name}`), 500);
};


return (
  <div className='items-page'>
    {items !== null ? (
      <div className='page-contents'>
        <div className='page-header'>
          <h1 className='inv-header-text'>Current items</h1>
        </div>
        <div className='inv-buttons'>
          {isSpecificitems ? (
            <>
            
              <button onClick={() => { navigate('/CreateItem'); resetItemDefaults() }}>
                Create New Item
              </button>
              <button onClick={() => { navigate('/'); setIsSpecificitems(false) }}>
                View Full items
              </button>
            </>
          ) : (
            <div>Browse the current items</div>
          )}
          {cookies.username && !isSpecificitems ? (
            <button onClick={itemsRedirect}>See My items</button>
          ) : (
            <></>
          )}
        </div>
        <div className='items'>
          {typeof items !== 'string' && items.length ? (
            items.map((item, index) => {
              return (
                <div className='items-item' key={index}>
                  <div className='item-text'>
                  <button onClick={() => navigate('/CreateItem')}>
  Create New Item
</button>
<button onClick={() => navigate('/Items')}>
  Browse all Items
</button>


                    <p>Name: {item.item_name}</p>
                    <p className='item-description'>
                      Description: {item.description || 'No description provided'}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className='item-buttons'>
                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          `Are you sure you want to delete this item?`
                        );
                        if (confirmDelete) {
                          deleteItem(item.id);
                        }
                      }}>
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        const newName = window.prompt(`What is the new name for ${item.item_name}?`);
                        if (newName) {
                          const newItem = { ...item, item_name: newName };
                          updateItem(item.id, newItem);
                        }
                      }}>
                      Update Name
                    </button>
                    <button
                      onClick={() => {
                        const newDesc = window.prompt( `What is the new description for ${item.item_name}?`);
                        if (newDesc) {
                          const newItem = { ...item, description: newDesc };
                          updateItem(item.id, newItem);
                        }
                      }}>
                      Update Description
                    </button>
                    <button
                      onClick={() => {
                        const newQuantity = window.prompt(
                          `What is the new quantity for ${item.item_name}?`
                        );
                        if (newQuantity) {
                          const newItem = { ...item, quantity: newQuantity };
                          updateItem(item.id, newItem);
                        }
                      }}>
                      Update Quantity
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>There are no items to display.</p>
          )}
        </div>
      </div>
    ) : (
      <p>Page is loading...</p>
    )}
  </div>
);

  }

export default UserItems;
