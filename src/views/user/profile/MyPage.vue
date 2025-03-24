<template>
    <div class="mypage-container">
      <h2 class="section-title">마이페이지</h2>
      <div class="divider"></div>
      
      <div class="button-group">
        <button @click="goToMainPage">달력 보기</button>
        <button @click="goToCheckUser('/change-name')">이름 바꾸기</button>
        <button @click="goToCheckUser('/change-password')">비밀번호 바꾸기</button>
        <button @click="vacations">휴가 신청 내역 조회</button>
      </div>
    </div>
  </template>

<script setup>
import { useRouter } from "vue-router";
  
const router = useRouter();

const goToMainPage = () => {
    router.push("/home");
}

// const changeName = () => {
//     router.push("/change-name");
// }

// const changePassword = () => {
//     router.push("/change-password");
// }

// 비밀번호 확인 페이지로 이동하면서 `nextRoute` 전달
const goToCheckUser = (nextRoute) => {
  router.push({ path: "/check-user", query: { nextRoute } });
};


const vacations = () => {
    router.push("/vacations");
}
</script>

<style scoped>
.mypage-container {
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  text-align: center;
  
  padding: 20px;
  
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.divider {
  width: 100%;
  height: 2px;
  background-color: #ddd;
  margin-bottom: 15px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: #2699e6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #2563eb;
}
</style>