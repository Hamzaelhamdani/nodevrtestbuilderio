// src/components/auth/AuthenticationFlow.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService, UserRole, LoginResponse } from '../../services/authService';

export default function AuthenticationFlow() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login'|'signup'>(
    location.search.includes('mode=signup') ? 'signup' : 'login'
  );

  // shared login fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // signup-only fields
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail]       = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm]   = useState('');
  const [signupRole, setSignupRole]         = useState<UserRole>('client');

  useEffect(() => {
    setMode(location.search.includes('mode=signup') ? 'signup' : 'login');
  }, [location.search]);

  // — LOGIN —
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result: LoginResponse = await login(email, password);
    console.log('[AuthFlow] login →', result);
    if (!result.success || !result.user) {
      alert(result.message || 'Login failed');
      return;
    }
    // utilise redirect_path retourné par le service
    const target = result.redirect_path ?? '/';
    navigate(target, { replace: true });
  };

  // — SIGN UP —
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      alert('Passwords do not match');
      return;
    }
    const result: LoginResponse = await authService.signUp({
      name:     signupFullName,
      email:    signupEmail,
      password: signupPassword,
      role:     signupRole,
    });
    console.log('[AuthFlow] signup →', result);
    if (!result.success) {
      alert(result.message || 'Registration failed');
      return;
    }
    alert('Registration successful! You can now log in.');
    setMode('login');
    // pré-remplir le formulaire de login
    setEmail(signupEmail);
    setPassword('');
    // reset du formulaire d’inscription
    setSignupFullName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirm('');
    setSignupRole('client');
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
            required
            autoComplete="email"
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <button
            type="submit"
            className="w-full p-2 rounded bg-[#8BFF4D] font-semibold"
          >
            Sign In
          </button>
          <p className="text-center text-gray-400">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-green-400 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={signupFullName}
            onChange={e => setSignupFullName(e.target.value)}
            required
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={e => setSignupEmail(e.target.value)}
            required
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={e => setSignupPassword(e.target.value)}
            required
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupConfirm}
            onChange={e => setSignupConfirm(e.target.value)}
            required
            className="w-full p-2 border rounded bg-gray-900 text-white"
          />
          <select
            value={signupRole}
            onChange={e => setSignupRole(e.target.value as UserRole)}
            required
            className="w-full p-2 border rounded bg-gray-900 text-white"
          >
            <option value="client">Client</option>
            <option value="startup">Startup</option>
            <option value="structure">Support Structure</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full p-2 rounded bg-[#8BFF4D] font-semibold"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-green-400 hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
