import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Routes, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Login from './components/views/Login';
import ItemList from './components/views/ItemsList';
import CreateAccount from './components/views/CreateAccount';
import Guest from './components/views/Guest';
import UserItems from './components/views/UserItems';
import CreateItem from './components/views/CreateItem';
import Context from './Context';
import { ContextProvider } from './Context';

function App() {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [currentItem, setCurrentItem] = useState({});

  const handleLogin = async (username, password) => {
    const response = await axios.post('/login', { username, password });
    setUser(response.data);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Context.Provider value={{ user, handleLogin, handleLogout }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/createItem" element={<CreateItem />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/itemsGuest" element={<Guest />} />
        <Route path="/items/:username" element={<UserItems
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              currentItem={currentItem}
              setCurrentItem={setCurrentItem} />} />
        
      </Routes>
    </Context.Provider>
  );
}

export default App;