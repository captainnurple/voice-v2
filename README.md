# voice-v2

## Initial Setup Steps

Initialize/create project via `vue ui`, with node 2.x, router, and vuex

Create a git repo on github.com

Add repo locally as origin via `git remote add origin [URL]`

Push `git push origin master`

Create a new site on netlify

Add a git repo on the netlify site as remote, using default build options (`dist` for director; `npm run build` for build command, etc)

Let netlify run initial build. Site should be live!

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
