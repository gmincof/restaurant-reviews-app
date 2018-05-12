module.exports = JSON.stringify({
  name: 'Restaurant Reviews',
  short_name: 'Restaurants',
  theme_color: '#252831',
  background_color: '#ffffff',
  display: 'standalone',
  Scope: '/',
  start_url: '/',
  icons: [72, 96, 128, 144, 152, 192, 384, 512].map(size => ({
    src: require(`./img/icons/icon-${size}x${size}.png`),
    sizes: `${size}x${size}`,
    type: 'image/png'
  })),
  splash_pages: null
})
