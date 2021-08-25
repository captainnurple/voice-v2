<template>
  <div class="home">
    <button v-on:click="login()">Login</button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  methods: {
    login() {
      console.log("clicked");
      window.netlifyIdentity.open();
    },
  },
  mounted() {
    console.log("mounted");
    // Bind to events
    window.netlifyIdentity.on("init", (user) => console.log("init", user));
    window.netlifyIdentity.on("login", (user) => console.log("login", user));
    window.netlifyIdentity.on("logout", () => console.log("Logged out"));
    window.netlifyIdentity.on("error", (err) => console.error("Error", err));
    window.netlifyIdentity.on("open", () => console.log("Widget opened"));
    window.netlifyIdentity.on("close", () => console.log("Widget closed"));
    // Init
    window.netlifyIdentity.init();
  },
};
</script>
