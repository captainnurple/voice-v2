<template>
  <div class="home">
    <button v-on:click="login()">Login</button>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapGetters("auth", {
      isLoggedIn: "getUserStatus",
      user: "getUser",
    }),
  },
  methods: {
    ...mapActions({
      updateUser: "auth/updateUser",
    }),
    login() {
      console.log("clicked");
      window.netlifyIdentity.open();
    },
  },
  mounted() {
    console.log("mounted");
    // Bind to events
    // window.netlifyIdentity.on("init", (user) => {
    window.netlifyIdentity.on("init", () => {
      console.log("init");
      // console.log("init", JSON.stringify(user, null, 2));
      // console.log(this.user);
    });
    window.netlifyIdentity.init(); // If I call this AFTER hooking into login, then my login hook gets called by init() if there's an existing user in localStorage

    window.netlifyIdentity.on("login", (user) => {
      console.log("login");
      // console.log("login", JSON.stringify(user, null, 2));
      this.updateUser({
        currentUser: user,
      });
    });

    window.netlifyIdentity.on("logout", () => {
      console.log("Logged out");
      this.updateUser({
        currentUser: null,
      });
    });

    window.netlifyIdentity.on("error", (err) => console.error("Error", err));

    // window.netlifyIdentity.on("open", () => console.log("Widget opened"));
    // window.netlifyIdentity.on("close", () => console.log("Widget closed"));
    // Init
  },
};
</script>
