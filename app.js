export function renderApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  const placeholder = document.createElement('div');
  placeholder.textContent = 'RSNA beýni MRT hasabat platformasy ýüklenýär...';
  placeholder.style.fontSize = '1rem';
  placeholder.style.color = '#4b5563';

  appRoot.innerHTML = '';
  appRoot.appendChild(placeholder);
}

renderApp();
