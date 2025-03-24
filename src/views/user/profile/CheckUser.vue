<template>
    <div class="check-user-container">
      <div class="check-user-card">
        <h2 class="check-user-title">비밀번호 확인</h2>
  
        <div class="input-group">
          <label for="password">비밀번호 입력</label>
          <input type="password" id="password" v-model="password" placeholder="비밀번호 입력">
        </div>
  
        <div class="button-group">
          <button class="btn confirm" @click="verifyPassword">확인</button>
          <button class="btn cancel" @click="goToMyPage">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useRouter, useRoute } from "vue-router";
  
  const password = ref(""); 
  const router = useRouter();
  const route = useRoute();
  
  // URL에서 `nextRoute` 가져오기
  const nextRoute = route.query.nextRoute || "/mypage"; 
  
  const verifyPassword = () => {
    // DB 연동 후 비밀번호 검증 추가
    router.push(nextRoute); // 비밀번호 확인 후 이동
  };
  
  const goToMyPage = () => {
    router.push("/mypage");
  };
  </script>
  
  <style scoped>
  .check-user-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 100vh; */
    /* background-color: #f3f4f6; */
  }
  
  .check-user-card {
    /* background: white; */
    padding: 30px;
    /* border-radius: 12px; */
    /* box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); */
    text-align: center;
    width: 100%;
    max-width: 400px;
  }
  
  .check-user-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-bottom: 16px;
  }
  
  .input-group label {
    font-size: 14px;
    color: #555;
    margin-bottom: 4px;
  }
  
  .input-group input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
  }
  
  .button-group {
    display: flex;
    /* gap: 10px; */
    justify-content: space-between;
  }
  
  .btn {
    padding: 10px;
    width: 48%;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    color:white
  }
  
  .confirm {
    background-color: #2699e6;
  }
  
  .confirm:hover {
    background-color: #2563eb;
  }
  
  .cancel {
  background-color: #ccc;

}

.cancel:hover {
  background-color: #999;
}
  </style>
  