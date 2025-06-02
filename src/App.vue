<template>
  <div id="app">
    <MainHeader @openSidebar="openSidebar" />
    <main class="content">
      <router-view />
    </main>
    <MainFooter />
  </div>
</template>

<script>
import { ref } from "vue";
import MainHeader from "./components/MainHeader.vue";
import MainFooter from "./components/MainFooter.vue";

export default {
  components: {
    MainHeader,
    MainFooter,
  },
  setup() {
    const isSidebarOpen = ref(false);

    // 사이드바 열기
    const openSidebar = () => {
      isSidebarOpen.value = true;
    };

    // 사이드바 닫기
    const closeSidebar = () => {
      isSidebarOpen.value = false;
    };

    return {
      isSidebarOpen,
      openSidebar,
      closeSidebar,
    };
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
  /* display: flex; */
  flex-grow: 1;
  overflow-y: auto; /* 내용이 많으면 스크롤 */
  padding: 20px;
  /* position: relative; */
}

.notifications-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 1000;
}
</style>
