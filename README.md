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
// eslint-disable-next-line no-unused-vars
exports.handler = async function (event, context) {
  console.log("hello, World!");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};
```

Note the use of `async` - this is crucial to work in deployment, even though it will work without in local dev. (see Netlify docs for more)

And create `apitests.http` in the root with:

`GET http://localhost:8888/.netlify/functions/hello`

If you have REST Client installed in VSCode, you should be able to click to test after deploying locally via `netlify dev`

If everything worked, you should get a hello, World! response from the REST Client test!

# FaunaDB

(Fauna and Netlify provide CLI tools to do this, but we'll skip that for now)

Login to Fauna and click "Create Database."

Name your database, and then select GraphQL on the sidebar.

Locally, create a database folder with a schema in it `db/schema.gql` with the following schema (modify as necessary):

```
type User {
  netlifyID: ID! # ! means can't return null
  email: String!
}
```

After importing your schema, test the following GraphQL query to ensure functionality:

```
# Write your query or mutation here
mutation {
  createUser(data: {netlifyID: 1, email:"bob"}) {
    netlifyID
    email
  }
}
```

If it worked, you should see the new entry in your Collections (as an entry in a new "User" collection). Hooray! Go ahead and delete that entry, and now we can wire up the new user signup hooks.

# Identity Function Hooks
### Bringing it together.

We can now bring Netlify fuctions together with FaunaDB, using [Identity Function hooks](https://docs.netlify.com/functions/functions-and-identity/).

Create your signup hook in `functions/identity-signup.js`. This will get called every time a new user signs up via Identity.

See discussion [here](https://youtu.be/wqQ6kF-psu4?t=2635)

Test via the following: 
```
exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));

  return {
    statusCode: 200,
    // body: JSON.stringify({ app_metadata: { roles: ["user"] } }), // Optional metadata args; see docs
  };
};

```

If everything is working, you should be able to register a new user, and AFTER clicking the confirmation email, the Netlify function log should output the user object for that new signup!

## Wiring it Up to Fauna

**First install helper functions.** 

Netlify can now include anything you npm install in root, so add the following:

`npm i node-fetch@2.6.2`

(node-fetch v3 requires different syntax so avoid it for now)

Then add the following line at the top of `identity-signup.js`

`const fetch = require('node-fetch');`

Navigate to your database in Netlify and go to the "Security" tab on the left. Select create a new key, and select "Server" key in the Role dropdown. Give it a name and the Key will appear.

Copy the key and go back over to Netlify.

Go to Site Settings > Build & Deploy > Environment > Edit Variables

Add an environment variable called FAUNA_SERVER_KEY and paste in the Key you copied above.

From our Netlify function, we'll call Fauna as follows, adding the below code to our function:

```
const netlifyID = user.id;
const email = user.email;

const response = await fetch('https://graphql.fauna.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
  },
  body: JSON.stringify({
    query: `
      mutation ($netlifyID: ID! $email: String!) {
        createUser(data: {netlifyID: $netlifyID, email: $email}) {
          netlifyID
          email
        }
      }
    `,
    variables: {
      netlifyID,
      email
    }
  })
})
  .then(res => res.json())
  .catch(err => console.error(JSON.stringify(err, null, 2)));

console.log({ response });
```

Now run through a test user signup. If all goes well, you should see a new entry in your FaunaDB containing that user's email and netlifyID!










