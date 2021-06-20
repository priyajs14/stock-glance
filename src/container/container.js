import React from 'react';
import { useEasybase } from 'easybase-react';
import Login from '../login/login';
import Header from '../header/header';
import Dashboard from '../dashboard/dashboard';
import './container.css';

function Container() {
  const { isUserSignedIn } = useEasybase();

  console.log(isUserSignedIn());
  return (
    <div className="container">
      <Header />
      {isUserSignedIn() ? <Dashboard /> : <Login />}
    </div>
  );
}

export default Container;
