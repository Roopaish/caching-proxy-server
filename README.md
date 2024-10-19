# Caching Proxy Server

[Roadmap.sh](https://roadmap.sh/projects/caching-server)

## Setup

- Clone the repository
- Install dependencies `npm install`
- Build the project `npx tsc`
- Run the project `node ./build/cli.js --port 3000 --origin "https://dummyjson.com"`
- make requests to server `http://localhost:3000/products`

> Running it with caching-proxy command

- cd into build folder
- Create a global symlink for this package `npm link`
- Run like `caching-proxy --port 3000 --origin "https://dummyjson.com"`
- To clear cache `caching-proxy --clear-cache`
