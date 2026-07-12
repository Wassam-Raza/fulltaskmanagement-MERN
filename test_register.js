fetch('https://fulltaskmanagement-mern.vercel.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'test',
    email: 'test_native_fetch_1@test.com',
    password: 'test',
    role: 'user'
  })
}).then(res => res.json().then(data => ({status: res.status, body: data})))
  .then(res => console.log('RESPONSE:', res))
  .catch(err => console.log('ERROR:', err));
