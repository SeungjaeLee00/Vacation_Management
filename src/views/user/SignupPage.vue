<template>
    <div class="auth-container">
      <div class="auth-box">
        <h2>회원가입</h2>
        <form>
          <input type="number" placeholder="사번" required />
          <input type="text" placeholder="이름" required />
          <input type="password" placeholder="비밀번호" required />
          <input type="password" placeholder="비밀번호 확인" required />
          <button type="submit">가입하기</button>
        </form>
        <div class="link-to">
          <p>이미 계정이 있으신가요? <router-link to="login">로그인</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SignupPagge",
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
  
  h2 {
    margin-bottom: 1rem;
  }
  
  input {
    width: 90%;
    height: 25px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #2699e6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
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
  