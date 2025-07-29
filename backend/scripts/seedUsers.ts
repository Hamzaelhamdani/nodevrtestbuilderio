import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth/register';

const users = [
  {
    email: "admin@example.com",
    password: "AdminPass123!",
    role: "Admin",
    name: "Super Admin"
  },
  {
    email: "support1@ventures.com",
    password: "SupportPass123!",
    role: "SupportStructure",
    name: "Support Structure 1"
  },
  {
    email: "support2@ventures.com",
    password: "SupportPass123!",
    role: "SupportStructure",
    name: "Support Structure 2"
  },
  {
    email: "support3@ventures.com",
    password: "SupportPass123!",
    role: "SupportStructure",
    name: "Support Structure 3"
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    email: `startup${i + 1}@ventures.com`,
    password: "StartupPass123!",
    role: "Startup",
    name: `Startup ${i + 1}`
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    email: `client${i + 1}@ventures.com`,
    password: "ClientPass123!",
    role: "Client",
    name: `Client ${i + 1}`
  }))
];

const seed = async () => {
  for (const user of users) {
    try {
      const res = await axios.post(BASE_URL, user);
      console.log(`✅ ${user.email} registered`);
    } catch (err: any) {
      console.error(`❌ ${user.email} failed:`, err.response?.data || err.message);
    }
  }
};

seed();
