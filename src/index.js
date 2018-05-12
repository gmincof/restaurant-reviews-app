import 'intersection-observer';
import 'normalize.css'
import './css/style.css'
import './css/map.css'

document.head.insertAdjacentHTML('beforeend', `
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
`)

switch (window.location.pathname) {
  case '/':
  case '/index.html':
    import('./restaurants')
  break

  case '/restaurant.html':
    import('./restaurant')
  break
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    window.navigator.serviceWorker.register('/sw.js')
  })
}
