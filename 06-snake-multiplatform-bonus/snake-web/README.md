This is the Web implementation of the Snake game. It depends on the [snake-lib](../snake-lib) package, which is also part of this repo.

## Run it

First make sure to build the `snake-lib` package:

```sh
cd snake-lib
npm install
npm run build
```

Then you can run the web app:

```sh
cd ../snake-web
npm install
npm run dev
```

## Notes

Since the `snake-lib` package is not published to npm, it is referenced in the `snake-web` `package.json` as a local dependency:

```json
"dependencies": {
  "snake-lib": "file:../snake-lib"
}
```

To make that work with Vite, I added the following config to the `vite.config.js` file:

```js
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        include: ['snake-lib']
    }
});
```

This tells Vite to include the `snake-lib` package in the bundle. More info [here](https://vitejs.dev/config/dep-optimization-options.html#optimizedeps-include)

More info about dependency bundling and monorepos [here](https://vitejs.dev/guide/dep-pre-bundling.html#monorepos-and-linked-dependencies).