<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>로그인</h2>
      <form @submit.prevent="login">
        <input type="number" placeholder="사번" v-model="number" />
        <input type="password" placeholder="비밀번호" v-model="password" @keydown="checkCapsLock"/>
        <span v-if="capsLockActive" class="caps-lock-warning">Caps Lock이 켜져 있습니다.</span>
        <button type="submit">로그인</button>
      </form>
      <div class="link-to">
        <p>비밀번호를 잊으셨나요? <router-link to="/find-password">비밀번호 찾기</router-link></p>
      </div>
    </div>
  </div>
  </template>
    
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  
  const number = ref('');  // 사번번
  const password = ref('');
  const router = useRouter();
  
  const isLoggedIn = ref(false); 
  const capsLockActive = ref(false);

  const checkCapsLock = (event) => {
    const isCapsLock = event.getModifierState("CapsLock");
    capsLockActive.value = isCapsLock;
  };
  
  // 로그인 로직
  const login = async () => {
    try {
      const response = await axios.post("http://localhost:8088/api/auth/login", {
        employeeId: number.value, 
        password: password.value,
      }, {
        withCredentials: true
      });
      // console.log("response", response);
  
      if (response.status === 200) {
        isLoggedIn.value = true;
        alert("로그인 성공")
        sessionStorage.setItem('userId', number.value);

        router.push('/home');
      } else {
          alert('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      alert('로그인 요청 실패');
    }
  };
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

  .caps-lock-warning {
    color: red;
    font-size: 12px;
    margin-top: 5px;
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
  