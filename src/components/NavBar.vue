<template>
    <b-navbar toggleable="md" type="dark" variant="primary" class="nav-bar">
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand href="#">
          <img src="https://i.imgur.com/H4vq5CP.png" alt="Chat About It!">
          </b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
          <b-navbar-nav variant="light">
        <b-nav-item href="#">Check your level</b-nav-item>
        <b-nav-item href="#">Practice questions</b-nav-item>
          </b-navbar-nav>
            <b-navbar-nav class="ml-auto logged_user" >
                Welcome back, {{logged_user}}
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    logged_user: String
  }
};
</script>

<style scoped>
.nav-bar {
  border-bottom: 1px solid #17a2b8;
}
.nav-bar img{
  width: 70%;
}
.logged_user {
  padding: 10px;
  font-size: 1.5em;
}
</style>