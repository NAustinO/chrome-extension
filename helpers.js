function injectStyles() {
  const link = document.createElement('link');
  link.href = './style.css';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

