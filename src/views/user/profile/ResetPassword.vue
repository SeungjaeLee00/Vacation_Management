<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <h2 class="reset-password-title">비밀번호 재설정</h2>
      
      <div class="input-group">
        <label for="current-password">현재 비밀번호</label>
        <input type="password" id="current-password" v-model="currentPassword" placeholder="현재 비밀번호 입력">
      </div>

      <div class="input-group">
        <label for="new-password">새로운 비밀번호</label>
        <input type="password" id="new-password" v-model="newPassword" placeholder="새 비밀번호 입력">
      </div>

      <div class="input-group">
        <label for="confirm-password">새로운 비밀번호 확인</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="새 비밀번호 확인">
      </div>

      <div class="button-group">
        <button class="btn save" @click="submitChangePassword">저장</button>
        <button class="btn cancel" @click="goToMyPage">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const currentPassword = ref(""); 
const newPassword = ref(""); 
const confirmPassword = ref(""); 
const router = useRouter();

const goToMyPage = () => {
  router.push("/mypage");
};

const submitChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
    return;
  }

  const passwordData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  };

  try {
    const response = await axios.put("http://localhost:8088/api/user/change-password", passwordData, {
      withCredentials: true,
    });

    alert(response.data);
    router.push("/mypage");
  } catch (error) {
    console.error("비밀번호 변경 실패:", error.response ? error.response.data : error.message);
    alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
  }
};
</script>


<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;

}

.reset-password-card {
  padding:30px;
  width: 400px;
  text-align: center;
}

.reset-password-title {
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
  color: white;
}

.save {
  background-color: #2699e6;
}

.save:hover {
  background-color: #2563eb;
}

.cancel {
  background-color: #ccc;
  

}

.cancel:hover {
  background-color: #999;
}
</style>
