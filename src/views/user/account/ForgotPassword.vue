<template>
  <div class="forgot-password-container">
    <div class="forgot-password-card">
      <h2 class="forgot-password-title">비밀번호 찾기</h2>
      
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" placeholder="이메일 입력">
      </div>

      <div class="button-group">
        <button class="btn send" @click="sendTemporaryPassword">임시 비밀번호 전송</button>
        <button class="btn cancel" @click="goToLoginPage">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const router = useRouter();

const sendTemporaryPassword = async () => {
  if (!email.value) {
    alert("이메일을 입력해주세요.");
    return;
  }

  console.log("입력된 이메일:", email.value);
  console.log("서버 없이 콘솔에서 확인 중...");

  // TODO: 서버 구현 후 아래 API 호출 활성화
  /*
  try {
    const response = await fetch("/api/send-temp-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("임시 비밀번호가 이메일로 전송되었습니다.");
      router.push("/login"); // 로그인 페이지로 이동
    } else {
      alert(result.message || "이메일 전송 실패. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error(error);
    alert("서버 오류 발생. 다시 시도해주세요.");
  }
  */

  // 서버가 없으므로 가정하여 성공 메시지 출력 후 이동
  setTimeout(() => {
    alert("임시 비밀번호가 이메일로 전송되었습니다.");
    router.push("/login");
  }, 1000);
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
</style>
