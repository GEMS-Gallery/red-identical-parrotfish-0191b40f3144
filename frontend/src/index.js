import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const name = 'World';
  const greeting = await backend.greet(name);
  document.getElementById('root').textContent = greeting;
});
