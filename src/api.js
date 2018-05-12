import idb from 'idb'

const URL = 'http://localhost:1337'

const IDB = idb.open('restaurants', 1, upgradeDB => {
  const restaurants = upgradeDB.createObjectStore('restaurants', {
    keyPath: 'id'
  })
  restaurants.createIndex('updatedAt', 'updatedAt')

  const reviews = upgradeDB.createObjectStore('reviews', {
    keyPath: 'id', autoIncrement: true
  })
  reviews.createIndex('restaurant_id', 'restaurant_id')
  reviews.createIndex('createdAt', 'createdAt')
})

export function getAllRestaurants() {

  return (
    fetch(`${URL}/restaurants`)
      .then(resp => resp.json())
      .then(restaurants => {
        IDB.then(db => {
          const TX = db.transaction('restaurants', 'readwrite')
          restaurants.forEach(restaurant => {
            TX.objectStore('restaurants').put(restaurant)
          })
        })

        return restaurants
      })
      .catch(err => {
        console.error(err)

        return (
          IDB
            .then(db =>
              db.transaction('restaurants')
                .objectStore('restaurants')
                .getAll()
            )
            .then(restaurants => restaurants)
            .catch(err => {
              console.error(err)
              return []
            })
        )
      })
  )
}

export function getRestaurantByID(id) {

  return (
    fetch(`${URL}/restaurants/${id}`)
      .then(resp => resp.json())
      .then(restaurant => {
        IDB.then(db => {
          const TX = db.transaction('restaurants', 'readwrite')
          TX.objectStore('restaurants').put(restaurant)
        })

        return restaurant
      })
      .catch(err => {
        console.error(err)

        return (
          IDB
            .then(db =>
              db.transaction('restaurants')
                .objectStore('restaurants')
                .get(id)
            )
            .then(restaurant => restaurant)
            .catch(err => {
              console.error(err)
              return {}
            })
        )
      })
  )
}

export function getAllReviewsByRestaurantID(id) {

  return (
    fetch(`${URL}/reviews/?restaurant_id=${id}`)
      .then(resp => resp.json())
      .then(reviews => {
        IDB.then(db => {
          const TX = db.transaction('reviews', 'readwrite')
          reviews.forEach(review => {
            TX.objectStore('reviews').put(review)
          })
        })

        return reviews
      })
      .catch(err => {
        console.error(err)

        return (
          IDB
            .then(db =>
              db.transaction('reviews')
                .objectStore('reviews')
                .index('restaurant_id')
                .getAll(id)
            )
            .then(reviews => reviews)
            .catch(err => {
              console.error(err)
              return []
            })
        )
      })
  )
}

export function addRestaurantReview(review) {

  return (
    fetch(`${URL}/reviews`, { method: 'POST', body: JSON.stringify(review) })
      .then(resp => resp.json())
      .then(review => {
        IDB.then(db => {
          const TX = db.transaction('reviews', 'readwrite')
          TX.objectStore('reviews').put(review)
        })

        return review
      })
      .catch(err => {
        console.error(err)

        return (
          IDB
            .then(db => {
              let newReview = review
              newReview.createdAt = ''

              const TX = db.transaction('reviews', 'readwrite')
              TX.objectStore('reviews').put(newReview)
              return TX.complete
            })
            .then(() => review)
            .catch(err => {
              console.error(err)
              return {}
            })
        )
      })
  )
}

export function favoriteRestaurant(restaurant) {

  return (
    fetch(`${URL}/restaurants/${restaurant.id}/?is_favorite=${restaurant.is_favorite}`, { method: 'PUT' })
      .then(resp => resp.json())
      .then(restaurant => {
        IDB.then(db => {
          const TX = db.transaction('restaurants', 'readwrite')
          TX.objectStore('restaurants').put(restaurant)
        })

        return restaurant
      })
      .catch(err => {
        console.error(err)

        return (
          IDB.then(db => {
            restaurant.updatedAt = ''

            const TX = db.transaction('restaurants', 'readwrite')
            TX.objectStore('restaurants').put(restaurant)
            return TX.complete
          })
          .then(() => restaurant)
          .catch(err => {
            console.error(err)
            return {}
          })
        )
      })
  )
}

export const restaurantImg = (function() {
  let format = 'jpg'

  // https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
  const img = new Image()
  img.onload = () => img.width > 0 && img.height > 0 ? format = 'webp' : ''
  img.src = 'data:image/webpbase64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'

  return function(restaurant) {
    if (!restaurant.photograph) return ''

    return format === 'webp' ?
      require(`file-loader?name=[hash].webp!image-webpack-loader?webp=quality=75!./img/restaurants/${restaurant.photograph}.jpg`) :
      require(`file-loader!image-webpack-loader!./img/restaurants/${restaurant.photograph}.jpg`)
  }
})()

export function restaurantHref(restaurant) {
  return `/restaurant.html?id=${restaurant.id}`
}

function storeOffline() {
  IDB
    .then(db =>
      db.transaction('reviews')
        .objectStore('reviews')
        .index('createdAt')
        .getAll('')
    )
    .then(offlineReviews => {
      offlineReviews.forEach(review => addRestaurantReview(review))
    })

  IDB
    .then(db =>
      db.transaction('restaurants')
        .objectStore('restaurants')
        .index('updatedAt')
        .getAll('')
    )
    .then(offlineFavorites => {
      offlineFavorites.forEach(restaurant => favoriteRestaurant(restaurant))
    })
}

storeOffline()
window.addEventListener('online', storeOffline)
