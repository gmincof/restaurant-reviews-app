workbox.skipWaiting()
workbox.clientsClaim()

workbox.precaching.precacheAndRoute(self.__precacheManifest)

workbox.routing.registerRoute(
  /\/restaurant\.html\?id=\d+$/,
  workbox.strategies.cacheFirst(),
)

workbox.routing.registerRoute(
  /^https\:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
  workbox.strategies.staleWhileRevalidate(),
)
