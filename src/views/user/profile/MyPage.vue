<template>
  <div class="mypage-container">
    <h2 class="mypage-title">{{ userName }} 님, 환영합니다.</h2>
    <div class="divider"></div>

    <div class="mypage-vacation-balance">
      <span class="mypage-highlighted-text">
        <p>잔여 휴가수 <span class="highlight">{{ remainingLeaves }}</span>일</p>
      </span>
    </div>
    
    <div class="mypage-button-group">
      <button @click="goToMainPage">달력 보기</button>
      <button @click="goToCheckUser('/change-name')">이름 바꾸기</button>
      <button @click="goToCheckUser('/change-password')">비밀번호 바꾸기</button>
      <button @click="vacations">휴가 신청 내역 조회</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

// 사용자 이름을 저장하는 변수
const userName = ref(""); 

// 잔여 휴가 수 (예제: 10일 남음 -> 나중에 다시 구현해야 함..)
const remainingLeaves = ref(10);
const router = useRouter();

// 사용자 정보 가져오기 함수
const fetchUserInfo = async () => {
  try {
    const response = await axios.get("http://localhost:8088/api/user/me", {
      headers: {
        Authorization: `Bearer ${Cookies.get("Token")}`, 
      },
      withCredentials: true,
    });
   console.log("response", response)
    userName.value = response.data.name;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error.response ? error.response.data : error.message);
  }
};

onMounted(fetchUserInfo);

const goToMainPage = () => {
    router.push("/home");
}

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

.mypage-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}


.mypage-vacation-balance {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.mypage-highlighted-text {
  font-size: 20px;
  font-weight: bold;
  color: #2699e6;
}

.highlight {
  color: #ff4500; 
  font-weight: bold;  
  font-size: 30px;  
}

.divider {
  width: 100%;
  height: 2px;
  background-color: #ddd;
  margin-bottom: 15px;
}

.mypage-button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: #2699e6;
  color: white ;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
}

button:hover {
  background-color: #2563eb;
}
</style>