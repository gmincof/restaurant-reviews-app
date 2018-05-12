module.exports = ({ template }) => `
  <!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#252831">
      <link rel="manifest" href="${require('!file-loader?name=[hash].json!extract-loader!./manifest')}">
      <title>Restaurant Reviews</title>
      <link rel="preload" as="style" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
      <style>body { display:none }</style>
    </head>
    <body>
      <header>
        ${template === 'restaurant' ? `
          <a href="/">Restaurant Reviews</a>
          <nav></nav>
        ` : `
          <h1><a href="/">Restaurant Reviews</a></h1>
        `}
      </header>
      <main>
        <aside>
          <div class="map" role="button" aria-label="Displays the map" tabindex="0"></div>
        </aside>
      </main>
      <footer>Copyright © 2018 <a href="/">Restaurant Reviews</a> All Rights Reserved.</footer>
    </body>
  </html>
`
