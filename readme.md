# Prettify JSON ➕

This web extension prettifies the JSON fields in Kibana and OpenSearch.

This extension is a rewrite of [kibana-plus-web-ext](https://github.com/webdeveric/kibana-plus-web-ext).

## Local development

### Setup

```shell
cp .env.example .env
```

Set `TEST_URL` to the URl of your Kibana or OpenSearch site. This will let `web-ext` know which site to open automatically when it starts.

### Development

Run these in two different terminals.

- This runs `webpack` in watch mode.

  ```shell
  npm run dev
  ```

- This runs `web-ext` and loads the extension in Chrome.

  ```shell
  npm start
  ```

  This runs `web-ext` and loads the extension in Firefox and Chrome.

  ```shell
  npm run start:both
  ```

## Build the extension

This will transpile the plugin and build a `zip` file for the extension.

The `zip` will be put in `./build`.

```shell
npm run build
```

## Extension signing for Firefox

Define your api key / secret in your environment then run the following.

Credentials can be found at https://addons.mozilla.org/en-US/developers/addon/api/key/

This generates an `xpi` file and it will be put in `./build`.

```shell
npm run sign -- --api-key=$WEB_EXT_API_KEY --api-secret=$WEB_EXT_API_SECRET
```

## Useful links

- https://hacks.mozilla.org/2019/10/developing-cross-browser-extensions-with-web-ext-3-2-0/
- https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/
