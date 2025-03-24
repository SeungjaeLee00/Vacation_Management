<template>
  <div id="app">
    <MainHeader />
    <main class="content">
      <router-view />
    </main>
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
  #app {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
  }

  .content {
    flex-grow: 1;
    overflow-y: auto;  /* 내용이 많으면 스크롤 */
    padding: 20px;
  }
</style>
