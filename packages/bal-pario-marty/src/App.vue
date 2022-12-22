<script setup>
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div id="app">
    <b-navbar type="is-dark">
      <template #brand>
        <div class="is-flex is-align-items-center is-justify-content-center">
          <b-icon icon="glass-mug-variant" class="mx-3"></b-icon>
        </div>
      </template>

      <template #start>
        <b-navbar-item tag="router-link" to="/"> Home </b-navbar-item>
        <b-navbar-item tag="router-link" to="/busy-button">
          Busy Button Game
        </b-navbar-item>
      </template>
    </b-navbar>

    <router-view />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
