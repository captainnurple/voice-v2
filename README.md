# voice-v2

## Initial Setup Steps

Initialize/create project via `vue ui`, with node 2.x, router, and vuex

Create a git repo on github.com

Add repo locally as origin via `git remote add origin [URL]`

Push `git push origin master`

Create a new site on netlify

Add a git repo on the netlify site as remote, using default build options (`dist` for director; `npm run build` for build command, etc)

Let netlify run initial build. Site should be live!

To suppress `webpack.Progress` spam on hot reload, and to prevent `ERR_CONNECTION_TIMED_OUT` spam in browser console during local dev (see https://stackoverflow.com/q/52581143/675943), add vue.config.js with:

```
module.exports = {
  // transpileDependencies: ["vuetify"],
  devServer: {
    // suppresses the massive webpack.Progress terminal spam when running dev server
    progress: false,
    host: "localhost",
  },
};
```

## Local dev

Run `netlify dev` and make sure you use the **netlify** local server at localhost:8888, not the vue local server at :8080 or you may run into problems.

If local dev runs right you should be able to hot reload immediately.

## Identity

Enable identity in Netlify page settings

See: https://github.com/netlify/netlify-identity-widget

Add the following line into the head of `public > index.html` (at the end of `<head>` is fine.)
`<script type="text/javascript" src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>`

Add (likely to `App.vue`) one of the two component options listed at the repo above:

Option 1) Add a menu:
- Log in / Sign up - when the user is not logged in
- Username / Log out - when the user is logged in
  
  `<div data-netlify-identity-menu></div>`

Option 2) Add a simpler button:
- Simple button that will open the modal.

  `<div data-netlify-identity-button>Login with Netlify Identity</div>`

**NOTE** For local dev, as far as I can tell, only the "button" option above works, and requires Chrome. TODO: investigate further.

Otherwise, next step: move to more of a code-based solution as demo'd here: https://github.com/whizjs/netlify-identity-demo-vue

### Identity notes

Per the widget docs, you can bind to the various widget events via `window.netlifyIdentity`. For example, in the `mounted()` section of your component you can bind to login via

```
window.netlifyIdentity.on("login", (user) =>
  console.log("login", JSON.stringify(user, null, 2))
);
```

See docs for more.

**Identity and Vuex**

`auth.js` contains vuex code for managing Identity/auth states. Upon login, the auth state/user token is stored in vuex and persisted to localStorage (which will survive between browser sessions). Upon logout, vuex user and localStorage are purged.

# Netlify Functions

Netlify needs to know where the functions are, so create `netlify.toml` and insert:

```
[build]
  functions="/functions"
```

Then create a functions directory.

To test, create `hello.js` in functions directory with:

```
exports.handler = (event, context) => {
  return {
    statusCode: 200,
    body: "hello, World!"
  }
}
```

And create `apitests.http` in the root with:

`GET http://localhost:8888/.netlify/functions/hello`

If you have REST Client installed in VSCode, you should be able to click to test after deploying locally via `netlify dev`