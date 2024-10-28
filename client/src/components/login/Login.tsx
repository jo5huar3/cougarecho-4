import React, { useRef, useState, useEffect, Ref, MutableRefObject, RefObject, Children } from 'react';
import { Link, useNavigate, useLocation, HistoryRouterProps, RouteObject, NavLinkRenderProps } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { Context } from 'vm';
const LOGIN_URL = '/login';



const LoginPage = () => {
  const { setAuth }: Context = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [role_id, setRole_id] = useState();

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleLogin = async (e) => {
    e.preventDefault();
    //console.log('Login attempt', { username, password });
    // Add your login logic here
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user_name: username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const role_id = response?.data?.roles;
      setAuth({ username, password, roles: role_id, accessToken });
      setUsername('');
      setPassword('');
      if (from !== "/") {
        navigate(from, { replace: true });
      } else {

      }

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }

    }

    //navigate('/homepage');
  };

  const isLoginDisabled = username === '' || password === '';

  return (
    <div className="flex h-screen bg-[#0B3B24]">
      <div className="w-1/2 p-12 flex flex-col justify-between">
        <Link
          to="/"
          className="text-[#FAF5CE] text-2xl font-bold hover:text-[#FFFAD6] transition-colors duration-300"
        >
          echo
        </Link>
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-bold text-[#FAF5CE] mb-8">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-full bg-[#165C3A] text-[#FAF5CE] placeholder-[#8BC4A9]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-full bg-[#165C3A] text-[#FAF5CE] placeholder-[#8BC4A9]"
            />
            {errMsg && (
              <p className="text-red-500 text-sm">{errMsg}</p>
            )}
            <button
              type="submit"
              disabled={isLoginDisabled}
              className={`w-full p-4 rounded-full text-[#FAF5CE] ${isLoginDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#4a8f4f] hover:bg-[#5aa55f]'}`}
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#FAF5CE]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#D17A22] hover:underline">Register</Link>
          </p>
        </div>
        <div></div> {/* Spacer */}
      </div>
      <div className="w-1/2 bg-[#165C3A] flex justify-center items-center relative">
        <img
          src="../assets/undraw_happy_music_g6wc 3 (1).png"
          alt="Happy Music"
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.svg.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22300%22%20height%3D%22300%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-size%3D%2220%22%3EImage%20not%20found%3C%2Ftext%3E%3C%2Fsvg%3E';
            console.error('Error loading image:', e);
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;

/*

import React, { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';

const LOGIN_URL = '/login';

const LoginPage = () => {
  const { ...setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [username, password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt', { username, password });
    // Add your login logic here
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user_name: username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false
        }
      );
      const data = await response.data
      //localStorage.setItem('token', data.token)
      const token = localStorage.getItem('token');
      const payload = token?.split('.')[1];
      console.log(jwt)
      console.log(JSON.parse(atob(payload)))
      const role = (JSON.parse(atob(payload)))[1]
      console.log(token + "\nrole: " + role);
      setAuth({})
      setUsername('')
      setPassword('')
      setSuccess(true)
      console.log(response.data.role)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }

    }

    navigate('/homepage');
  };
*/