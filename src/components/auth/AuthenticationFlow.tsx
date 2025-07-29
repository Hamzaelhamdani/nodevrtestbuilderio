import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { getRedirectPath } from '../../services/authService';

export default function AuthenticationFlow() {
  const location = useLocation();
  // Check for ?mode=signup in the URL
  const initialMode = location.search.includes('mode=signup') ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  useEffect(() => {
    if (location.search.includes('mode=signup')) setMode('signup');
    else setMode('login');
  }, [location.search]);
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Signup state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupRole, setSignupRole] = useState('client');
  const { login, user } = useAuth();
  console.log('[AuthenticationFlow] user', user);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      console.log('[AuthenticationFlow] login result', result);
      if (!result.success) {
        alert(result.message || 'Login failed');
      } else if (user && user.role) {
        // Force redirect to startup dashboard for startup users
        if (user.role.toLowerCase() === 'startup') {
          navigate('/dashboard/startup', { replace: true });
        } else {
          const redirectPath = getRedirectPath(user.role);
          navigate(redirectPath, { replace: true });
        }
      }
    } catch {
      alert('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      alert('Passwords do not match');
      return;
    }
    try {
      const result = await authService.signUp({
        email: signupEmail,
        password: signupPassword,
        role: signupRole as 'client' | 'startup' | 'structure' | 'admin',
        name: signupFullName,
      });
      if (!result.success) {
        alert(result.message || 'Registration failed');
        return;
      }
      alert('Registration successful! You can now log in.');
      setMode('login');
      setEmail(signupEmail);
      setPassword('');
      setSignupFullName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirm('');
      setSignupRole('client');
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold text-gray-100 text-center">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h1>
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full p-2 rounded font-semibold bg-[#8BFF4D] text-black shadow-lg hover:bg-[#6be63b] transition-colors duration-200"
          >
            Sign In
          </button>
          <div className="text-center mt-2">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              type="button"
              className="text-green-400 hover:underline font-medium"
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={signupFullName}
            onChange={e => setSignupFullName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirm}
            onChange={e => setSignupConfirm(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            required
          />
          <select
            value={signupRole}
            onChange={e => setSignupRole(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="Client">Client</option>
            <option value="Startup">Startup</option>
            <option value="SupportStructure">Support Structure</option>
          </select>
          <button
            type="submit"
            className="w-full p-2 rounded font-semibold bg-[#8BFF4D] text-black shadow-lg hover:bg-[#6be63b] transition-colors duration-200"
          >
            Sign Up
          </button>
          <div className="text-center mt-2">
            <span className="text-gray-400">Already have an account? </span>
            <button
              type="button"
              className="text-green-400 hover:underline font-medium"
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
