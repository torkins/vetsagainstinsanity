
import React from "react";
import { useIdentityContext } from 'react-netlify-identity';

export function Login(props) {
  const { loginUser, signupUser } = useIdentityContext();
  const formRef = React.useRef();
  const [msg, setMsg] = React.useState('');

  const signup = () => {
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;

    signupUser(email, password)
      .then(user => {
        console.log('Success! Signed up', user);
        props.onLogin(user);
      })
      .catch(err => console.error(err) || setMsg('Error: ' + err.message));
  };

  return (
    <form
      ref={formRef}
      onSubmit={e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        loginUser(email, password, true)
          .then(user => {
            console.log('Success! Logged in', user);
            props.onLogin(user);  
          })
          .catch(err => console.error(err) || setMsg('Error: ' + err.message));
      }}
    >
      <div>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
      </div>
      <div>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
      </div>
      <div>
        <input type="submit" value="Log in" />
        <button onClick={signup}>Sign Up </button>
        {msg && <pre>{msg}</pre>}
      </div>
    </form>
  );
}

// log out user
export function Logout() {
  const { logoutUser } = useIdentityContext();
  return <button onClick={logoutUser}>You are signed in. Log Out</button>;
}

export function useLoggedInUsername() {
    let identityContext = useIdentityContext();
    console.debug(identityContext);
    return identityContext.user;
}

export function useLoggedIn() {
    return !!useLoggedInUsername();
}
