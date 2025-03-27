<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>회원가입</h2>
      <form @submit.prevent="submitForm">
        <input type="number" placeholder="사번" v-model="employeeId" required />
        <input type="text" placeholder="이름" v-model="name" required />
        <div class="email-verification">
          <input type="text" placeholder="이메일 아이디" v-model="emailId" required />
          <span>@</span>
          <select v-model="selectedDomain">
            <option value="">도메인 선택</option>
            <option value="naver.com">naver.com</option>
            <option value="gmail.com">gmail.com</option>
            <option value="daum.net">daum.net</option>
            <option value="직접 입력">직접 입력</option>
          </select>
          <input v-if="selectedDomain === '직접 입력'" type="text" placeholder="도메인 입력" v-model="customDomain" required />
          <button type="button" @click="sendVerificationCode" :disabled="isCodeSent">인증</button>
        </div>

        <div v-if="isCodeSent && !isVerified">
          <input type="text" placeholder="인증번호 입력" v-model="verificationCode" required />
          <button type="button" @click="verifyCode">인증 완료</button>
        </div>

        <p v-if="isVerified" class="verified-message">✔ 인증 완료되었습니다.</p>

        <input type="password" placeholder="비밀번호" v-model="password" required />
        <input type="password" placeholder="비밀번호 확인" v-model="confirmPassword" required />
        <button type="submit" :disabled="!isVerified">가입하기</button>
      </form>

      <div class="link-to">
        <p>이미 계정이 있으신가요? <router-link to="login">로그인</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 데이터 속성
const employeeId = ref("");
const name = ref("");
const emailId = ref("");
const selectedDomain = ref("");
const customDomain = ref("");
const password = ref("");
const confirmPassword = ref("");
const isCodeSent = ref(false);
const verificationCode = ref("");
const correctCode = ref("");
const isVerified = ref(false);

// 전체 이메일 계산
const fullEmail = computed(() => {
  if (selectedDomain.value === "직접 입력") {
    return emailId.value && customDomain.value ? `${emailId.value}@${customDomain.value}` : "";
  }
  return emailId.value && selectedDomain.value ? `${emailId.value}@${selectedDomain.value}` : "";
});

// 인증번호 전송
const sendVerificationCode = async () => {
  if (!fullEmail.value) {
    alert("이메일을 입력해주세요.");
    return;
  }

  try {
    correctCode.value = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`인증번호: ${correctCode.value}`);  // 실제 API 구현 시 이메일 전송
    isCodeSent.value = true;
    alert(`인증번호가 ${fullEmail.value} 로 전송되었습니다.`);
  } catch (error) {
    alert("인증번호 전송에 실패했습니다.");
    console.error(error);
  }
};

// 인증번호 확인
const verifyCode = () => {
  if (verificationCode.value === correctCode.value) {
    isVerified.value = true;
    alert("이메일 인증이 완료되었습니다.");
  } else {
    alert("인증번호가 올바르지 않습니다.");
  }
};

// 회원가입 폼 제출
const submitForm = () => {
  if (!isVerified.value) {
    alert("이메일 인증을 완료해주세요.");
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  alert("회원가입이 완료되었습니다!");
  // 회원가입 API 연동 필요
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
  width: 500px;
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

select{
  width: 90%;
  height: 45px;
  padding: 5px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 95%;
  padding: 10px;
  background-color: #2699e6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 10px;
  font-weight: bold;
}

button:hover {
  background-color: #0056b3;
}

.email-verification {
  display: flex;
  justify-content: center; 
  align-items: center;
  width: 100%; 
  gap: 5px;
}

.email-verification input {
  flex: 1; 
  max-width: 220px;
}

.email-verification select {
  flex-shrink: 0; 
  width: 120px;
}

.email-verification button {
  flex-shrink: 0; 
  width: 80px;
  height: 45px;
  margin-bottom: 10px;
  font-size: 14px;
  padding: 5px;
}

.verified-message {
  color: green;
  font-size: 12px;
  margin-top: 5px;
}

.link-to {
  border-top: 2px solid #ddd;
  margin-top: 10px;
}

.link-to p {
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
