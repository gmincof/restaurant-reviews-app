import './css/header.restaurant.css'
import './css/breadcrumbs.css'
import './css/restaurant.css'
import './css/map.restaurant.css'
import * as API from './api'
import parse from './parser'
import breadcrumbsTemplate from './html/breadcrumbs.html'
import restaurantTemplate from './html/restaurant.html'

let id = 0

for (let param of window.location.search.substr(1).split('&')) {
  if (param.startsWith('id=')) {
    id = Number(param.substr(3))
    break
  }
}

(async function() {
  // Data
  const [ restaurant, reviews ] = await Promise.all([
    API.getRestaurantByID(id),
    API.getAllReviewsByRestaurantID(id)
  ])


  // Fragments
  const breadcrumbsFragment = parse(breadcrumbsTemplate, restaurant)
  const restaurantFragment = parse(restaurantTemplate, {
    restaurant, API, reviews,
    operatingDays: Object.keys(restaurant.operating_hours)
  })


  // Events
  restaurantFragment.querySelector('form').addEventListener('submit', e => handleReview(e, restaurant.id))


  // Render
  document.querySelector('nav').append(breadcrumbsFragment)
  document.querySelector('main').prepend(restaurantFragment)
})()


const handleReview = (function() {
  const state = { disabled: false }

  return async function(e, id) {
    e.preventDefault()

    if (state.disabled) return

    state.disabled = true

    const submitElement = e.target.querySelector('[type=submit]')
    submitElement.disabled = true

    const [ name, rating, comments ] =
      Array
        .from(e.target.querySelectorAll('[name=name], [name=rating]:checked, [name=comments]'))
        .map(input => input.value)

    await API.addRestaurantReview({
      restaurant_id: id,
      name, rating, comments
    })

    e.target.reset()
    submitElement.disabled = false

    state.disabled = false

    window.alert('Your review was successfully added. Thanks for your time!')
  }
})()
