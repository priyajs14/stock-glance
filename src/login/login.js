import { useEasybase } from 'easybase-react';
import { useState } from 'react';

function Login() {
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const { signIn } = useEasybase();
  return (
    <div className="login">
      <h4>Username</h4>
      <input
        value={usernameValue}
        onChange={(e) => setUsernameValue(e.target.value)}
      />
      <h4>Password</h4>
      <input
        type="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <button
        className="login-btn"
        onClick={(_) => signIn(usernameValue, passwordValue)}
      >
        Sign In
      </button>
    </div>
  );
}

export default Login;
