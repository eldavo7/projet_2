const API_URL = 'http://localhost:3001/api';

export async function login(username, password, acceptTerms) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, acceptTerms })
  });

  return res.json();
}

export async function getUserHome() {
  const res = await fetch(`${API_URL}/user/home`);
  return res.json();
}

export async function getAdminDashboard() {
  const res = await fetch(`${API_URL}/admin/dashboard`);
  return res.json();
}
/*
const API_URL = 'http://localhost:3001/api';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getUserHome() {
  const res = await fetch(`${API_URL}/user/home`);
  return res.json();
}

export async function getAdminDashboard() {
  const res = await fetch(`${API_URL}/admin/dashboard`);
  return res.json();
}
*/