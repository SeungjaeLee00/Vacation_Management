<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="forgot-password-title">비밀번호 찾기</h2>
      
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일 입력">
      </div>

      <div class="button-group">
        <button class="btn send" @click="sendTemporaryPassword" :disabled="loading">
          {{ loading ? "전송 중..." : "임시 비밀번호 전송" }}
        </button>
        <button class="btn cancel" @click="goToLoginPage" :disabled="loading">취소</button>
      </div>

       <div v-if="loading" class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const loading = ref(false); 
const router = useRouter();

const sendTemporaryPassword = async () => {
  if (!email.value) {
    alert("이메일을 입력해주세요.");
    return;
  }

  loading.value = true; 

  try{
    await axios.post("http://localhost:8088/api/auth/forgot-password", {
      email: email.value,
    });
    alert("임시 비밀번호가 이메일로 전송되었습니다.");
    router.push("/login");
  } catch (error) {
    console.error(error);
    alert("이메일 전송에 실패했습니다. 이메일을 다시 확인해주세요.")
  } finally {
    loading.value = false; 
  }
};

const goToLoginPage = () => {
  router.push("/login");
};
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.forgot-password-card {
  padding: 30px;
  width: 400px;
  text-align: center;
}

.forgot-password-title {
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
  justify-content: space-between;
}

.btn {
  padding: 10px;
  width: 48%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.send {
  background-color: #2699e6;
}

.send:hover {
  background-color: #2563eb;
}

.cancel {
  background-color: #ccc;
}

.cancel:hover {
  background-color: #999;
}

.spinner {
  margin: 20px auto 0;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #2699e6;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

