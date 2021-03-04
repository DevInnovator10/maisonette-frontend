# maisonette-frontend

Maisonette's Front End Codebase. Build using React, Redux, and Next.js.

## Application Structure

Maisonette Frontend uses an Atomic Design engineering structure, with some modifications to allow for separated business logic from presentational concerns.

- *Atoms*: _small HTML elements with minimal styling_ e.g. `<Button />`
- *Molecules*: _groupings of Atoms with more advanced styling_ e.g. `<Cart Icon />`
- *Organisms*: _Non-HTML Redux actions which dispatch business logic. These are namespaced to Redux stores, and expose the higher order functions which get injected into upper level groupings of components._
- *Tissues*: _More complex groupings of atoms, and molecules wrapped in a Organism HOC_ e.g. `<Navigation />`
- *Organs*: _groupings of Tissues which are given a grid layout in the wrapper_ e.g. `<Plp-product-grid />`
- *Pages*: _next.js required component which exposes the actual endpoints to the user, these import organs and tissues to form actual page layouts_ ( Not totally fleshed out yet, but a good example is `products.js`. This uses the custom `server.js` to redirect requests to the appropriate page on the Next.js side._

## Files generated on build

#### `./navigation.js` , `cms-generals.js`

Since the navigation and cms-generals both come from external applications, **Solidus** and **CMS** respectivly, we load the data needed from the apis at build time to avoid not showing anything when the user first loads the page via SSR. In otherwords, this avoids a "flicker" on the frontened for both navigation and mobile navigation.

Because the app only builds every re-deploy, we need to then ensure that when a user visist the site that we are fetching the most up to date data _after_ the build. This is handled by making another call to fetch both navigation and CMS generals on every SSR.

```
// _app.js
...

const getAppConstants = async () => {
	const siteConstants = await getGenerals();

	fetchMainNavigation();
	storeMobileNavigation(siteConstants);
	storePromoContent(siteConstants);
};

...
```

## Running the App

### Local Setup

Dependencies:

- Node LTS 10.*
- nvm

Switching Node versions:
- If you haven't already, install nvm using `brew install nvm`
  - If you're using zsh, you'll also need to update the config. Use the command `nano ~/.zshrc` and add the following:
  ```
  export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
  ```
- `nvm install 10.19.0`
- `nvm use 10.19.0`

Environment File:
- You will need to create a `.env` file. You can use the `.env.example` as a template. If you run into issues, reach out to the team to see if their `.env` files have been configured differently.

Installation:

- `npm install`

Add PreCommit Hook:
The `addPreCommit.sh` bash script is on the root of the Frontend.  The job of this script is to create a pre-commit hook to execute the linter and run tests prior to a commit.

- `bash addPreCommit.sh` (might need to give it executable rights depending on your local environment)
- Observe `.git/hooks/pre-commit` has been added with the contents: `npm run lint && npm run tests`

Running local server:

- `npm run dev`
- go to `localhost:7777`

Some URLs to look at:

- localhost:7777/products?w=[:search_term]
- localhost:7777/product/[:slug | :id]

### Docker

Running the Maisonette Frontend locally using Docker is easy!

Build the Docker image:

```
docker build \
  --no-cache \
  --build-arg ASSET_HOST="https://assets.stg.env.maisonette.com" \
  --build-arg BRAINTREE_TOKEN="x" \
  --build-arg CLIENT_HOST="http://localhost:7777" \
  --build-arg CMS_HOST="https://strapi.stg.env.maisonette.com" \
  --build-arg DD_APPLICATION_ID="x" \
  --build-arg DD_CLIENT_TOKEN="x" \
  --build-arg GA_TRACKING_ID="x" \
  --build-arg GMAPS_KEY="x" \
  --build-arg JIFITI_HOST=https://maisonettedev.jifiti.com \
  --build-arg JWT_SECRET="x" \
  --build-arg KLAVIYO_COMPANY_ID="abcdef" \
  --build-arg NOCRAWL=true \
  --build-arg NODE_ENV="production" \
  --build-arg PAYPAL_CLIENT_ID="x" \
  --build-arg PAYPAL_ENV="sandbox" \
  --build-arg PREVIEW_ASSET_HOST="https://maisonette-lcl.s3.amazonaws.com" \
  --build-arg SENTRY_AUTH_TOKEN="x" \
  --build-arg NEXT_PUBLIC_SENTRY_DSN="https://2a22206f5cc74f0aa9946188b5ce3f97@sentry.io/1500600" \
  --build-arg NEXT_PUBLIC_SENTRY_ENV="lcl" \
  --build-arg SENTRY_ORG="maisonette-o5" \
  --build-arg SENTRY_PROJECT="frontend" \
  --build-arg SLI_HOST="https://maisonette.resultsdemo.com" \
  --build-arg SLI_LR_HOST="https://3562-1-demo.sli-r.com/r-api/1/r.json" \
  --build-arg SPEED_CURVE_ID="x" \
  --build-arg SOLIDUS_HOST="https://backend.stg.env.maisonette.com" \
  --build-arg ZENDESK_API_KEY="x" \
  -f Dockerfile \
  -t frontend:latest .
```

An optional build argument can be used to create a robots.txt that disallows crawling.

```
--build-arg NOCRAWL=true
```

To run the Docker container:

```
docker run -it \
  -p 127.0.0.1:7777:7777 \
  frontend:latest
```

