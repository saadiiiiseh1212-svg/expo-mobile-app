const users = [
  {
    id: 'u1',
    fullName: 'Ahmed Khan',
    email: 'customer@demo.com',
    password: 'Pass1234',
    role: 'customer',
  },
  {
    id: 'u2',
    fullName: 'Sara Manager',
    email: 'manager@demo.com',
    password: 'Pass1234',
    role: 'manager',
  },
];

export default users;

export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (found) {
        resolve(found);
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000);
  });
};

export const mockSignup = (newUser) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = users.some(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
      );
      if (exists) {
        reject(new Error('An account with this email already exists.'));
        return;
      }
      const created = { id: `u${users.length + 1}`, ...newUser };
      users.push(created);
      resolve(created);
    }, 1000);
  });
};