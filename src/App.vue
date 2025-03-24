<template>
  <div id="app">
    <MainHeader /> 
    <router-view />
    <MainFooter />
  </div>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import MainFooter from "./components/MainFooter.vue";


export default {
  components: {
    MainHeader,
    MainFooter
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  text-align: center;
  /* background-color: #f4f4f4; */
}
</style>
