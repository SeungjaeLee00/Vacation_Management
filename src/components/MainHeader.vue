<template>
  <header class="main-header">
    <div class="logo-container">
      <img :src="logo" alt="로고" class="logo" @click="goToMainPage" />
      <h1 class="title" @click="goToMainPage">휴가 계획표</h1>
    </div>
    <nav>
      <ul>
        <li><button @click="goToVacationForm">휴가 신청</button></li>
        <li><button @click="goToMyPage">마이페이지</button></li>
        <li><button @click="handleAuth">{{ isLoggedIn ? "로그아웃" : "로그인" }}</button></li>
      </ul>
    </nav>
  </header>
</template>
  
<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const isLoggedIn = ref(false); // 로그인 상태 (추후 실제 인증 로직 적용)
  const logo = require("@/assets/ta9_logo_long.png");

  const goToVacationForm = () => {
  router.push("/vacation-form");
};

  const goToMainPage = () => {
    router.push("/home");
  }
  
  const goToMyPage = () => {
    router.push("/mypage");
  };
  
  const handleAuth = () => {
    if (isLoggedIn.value) {
      // 로그아웃 로직 (추후 구현)
      isLoggedIn.value = false;
    } else {
      router.push("/login");
    }
  }; 
</script>
  
<style scoped>
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 2px solid #ddd;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 10px; 
  }
  
  .logo {
    width: 150px;
    height: auto;
    cursor: pointer;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    text-align: center; 
    flex-grow: 1; /* 공간 차지하도록 설정 */
  }
  
  nav ul {
    display: flex;
    gap: 15px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  nav button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    transition: color 0.3s;
    font-weight: bold;
  }
  
  nav button:hover {
    color: #2699e6;
  }
</style>
  