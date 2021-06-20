import React, { useEffect, useState } from 'react';
import { useEasybase } from 'easybase-react';

function Header() {
  const { signOut, isUserSignedIn, getUserAttributes } = useEasybase();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    getUserAttributes().then((data) => {
      setUserName(data?.name || null);
    });
  }, [isUserSignedIn()]);

  return (
    <>
      {isUserSignedIn() && userName ? (
        <div className="auth-header">
          <h1>Hello {userName}, Welcome to Stock Glance</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <h1 style={{ textAlign: 'center' }}>Welcome to Stock Glance</h1>
      )}
    </>
  );
}

export default Header;
