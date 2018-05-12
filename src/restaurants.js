import './css/filters.css'
import './css/restaurants.css'
import * as API from './api'
import parse from './parser'
import filtersTemplate from './html/filters.html'
import restaurantsTemplate from './html/restaurants.html'

(async function() {
  // Data
  const restaurants = await API.getAllRestaurants()


  // Fragments
  const filtersFragment = parse(filtersTemplate, {
    neighborhoods: Array.from(new Set(restaurants.map(r => r.neighborhood))).sort(),
    cuisines: Array.from(new Set(restaurants.map(r => r.cuisine_type))).sort()
  })
  const restaurantsFragment = parse(restaurantsTemplate, { restaurants, API })


  // Events
  filtersFragment.firstChild.addEventListener('change', handleFilters)
  restaurantsFragment.firstChild.addEventListener('change', e => handleFavorite(e, restaurants))


  // Lazy Loading Images
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      io.unobserve(entry.target)
      entry.target.src = entry.target.dataset.src
    })
  })

  restaurantsFragment
    .querySelectorAll('img[data-src]')
    .forEach(img => io.observe(img))


  // Render
  const main = document.querySelector('main')
  main.prepend(restaurantsFragment)
  main.prepend(filtersFragment)
})()

var handleFilters = (function() {
  const state = { neighborhood: '', cuisine: '' }

  return function(e) {
    state[e.target.name] = e.target.value

    document
      .querySelectorAll('.restaurants li')
      .forEach(element => element.hidden = (
        (state.neighborhood && state.neighborhood !== element.dataset.neighborhood) ||
        (state.cuisine && state.cuisine !== element.dataset.cuisine)
      ))
  }
})()

async function handleFavorite(e, restaurants) {
  e.target.disabled = true

  let restaurant = restaurants.filter(r => r.id == e.target.value)[0]
  restaurant.is_favorite = e.target.checked

  restaurant = await API.favoriteRestaurant(restaurant)

  e.target.checked = ['true', true].includes(restaurant.is_favorite)
  e.target.disabled = false
}
