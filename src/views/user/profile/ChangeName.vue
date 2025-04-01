<template>
  <div class="change-name-container">
    
    <div class="change-name-card">
      <h2 class="change-name-title">이름 바꾸기</h2>
      
      <div class="input-group">
        <label for="name">새로운 이름</label>
        <input type="text" id="name" v-model="newName" placeholder="새 이름 입력">
      </div>

      <div class="button-group">
        <button class="btn save" @click="updateName">저장</button>
        <button class="btn cancel" @click="goToMyPage">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";

const newName = ref(""); 
const router = useRouter();

const goToMyPage = () => {
  router.push("/mypage");
};

// 이름 변경 API 호출
const updateName = async () => {
  const updateData = {
    newName: newName.value,
  };

  try {
    await axios.put(
      "http://localhost:8088/api/user/update-name", 
      updateData, 
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("Token")}`, // 쿠키에서 Token을 가져와 Authorization에 추가
        },
        withCredentials: true, // 쿠키를 포함하여 요청
      }
    );
    alert("이름 변경이 완료되었습니다!");
    goToMyPage(); // 이름 변경 후 마이페이지로 이동
  } catch (error) {
    alert("이름 변경에 실패했습니다. 다시 시도해주세요.");
    console.error("이름 변경 오류:", error.response ? error.response.data : error.message); // 오류 메시지 출력
  }
};
</script>


<style scoped>
.change-name-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.change-name-card{
  padding: 30px;
  width: 400px;
  text-align: center;
}

.change-name-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  /* margin-bottom: 30px; */
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
