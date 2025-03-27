<template>
    <div class="auth-container">
        <div class="auth-box">
      <h2>로그인</h2>
      <form>
        <input type="number" placeholder="사번" v-model="number" />
        <input type="password" placeholder="비밀번호" v-model="password" />
        <button type="submit">로그인</button>
      </form>
      <div class="link-to">
        <p>계정이 없으신가요? <router-link to="/signup">회원가입</router-link></p>
        <p>비밀번호를 잊으셨나요? <router-link to="/find-password">비밀번호 찾기</router-link></p>
      </div>
    </div>
</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const number = ref('');
  const password = ref('');

  // 로그인 로직(구현 예정)
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  .auth-box {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 300px;
  }
  input {
    width: 90%;
    height: 25px;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    
  }
  button {
    margin-top:10px;
    width: 95%;
    padding: 10px;
    background-color: #2699e6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .link-to {
    border-top: 2px solid #ddd;
    margin-top:10px;
    
  }

  .link-to p{
    font-size: 13px;
    text-align: left;
  }

  .link-to a {    
    color: #2699e6;
    text-decoration: none;
  }
  
  .link-to a:hover {
    text-decoration: underline;
  }
  </style>