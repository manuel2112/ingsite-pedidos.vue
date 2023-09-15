<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" class="img-fluid logo">   -->
  <Header />
  <router-view />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'App',
  components: {
    Header: defineAsyncComponent(() => import('./components/Header.vue')),
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
