# GIFTSZO Manual Product Catalog

## Add products and categories
1. Open `products.json`.
2. Copy one product object and paste it inside the main `[...]` array, adding a comma between objects.
3. Give every product a unique `id`, name, price, and `category`. The category menu is generated automatically from the category names used by products.
4. Put images in the matching `assets/products/<product-id>/` folder and use those exact paths in `images`. One to five images are supported.
5. Upload the entire folder to Netlify to publish changes.

## Example image folder
`assets/products/prod-001/front.jpg`, `back.jpg`, `side1.jpg`, `side2.jpg`, `detail.jpg`. Create these folders and add your own image files; the sample JSON references are examples.

## Important
- The admin button, admin panel and login popup are hidden/disabled.
- Add to Cart and Buy Now remain disabled.
- Products are read from `products.json`; edits in a browser do not save. Redeploy after changes.
- Test through Netlify or a local web server; opening `index.html` directly as a file may block `fetch()` for `products.json`.
