<template>
  <div class="mypage-container">
    <h2 class="mypage-title">{{ userName }} 님, 환영합니다.</h2>
    <div class="divider"></div>

    <div class="mypage-vacation-balance">
      <!-- 전체 잔여 휴가 수 -->
      <span class="mypage-highlighted-text">
        <p>잔여 휴가수 <span class="highlight">{{ totalRemainingLeaves }}</span>일</p>
      </span>

      <!-- 종류별 잔여 휴가 수 -->
      <div class="mypage-vacation-types">
        <div
          v-for="(type, index) in vacationTypes"
          :key="index"
          class="vacation-item"
        >
          <span>{{ type }} {{ remainingLeavesMap[type] ?? 0 }}일</span>
        </div>
      </div>
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
import { useNotificationStore } from '@/stores/notificationStore';
import { showVacationToast } from "@/utils/showVacationToast";

const vacationTypes = [
  "연차", "하계휴가", "대체휴가", "포상휴가"
];

const userName = ref(""); 

// 잔여 휴가 수
const vacationBalances = ref([]);
const totalRemainingLeaves = ref(0); // 총 잔여 일수
const remainingLeavesMap = ref({});  // 휴가 종류별 남은 일수

const router = useRouter();
const store = useNotificationStore();

// 사용자 정보 가져오기 함수
const fetchUserInfo = async () => {
  try {
    const response = await axios.get("http://localhost:8088/api/user/me", {
      withCredentials: true,
    });
  //  console.log("response", response)
    userName.value = response.data.name;
  } catch (error) {
    console.error("사용자 정보 가져오기 실패:", error.response ? error.response.data : error.message);
  }
};

// 잔여 휴가 수 조회하는 함수
const fetchRemainingLeaves = async () => {
  try {
    const response = await axios.get("http://localhost:8088/api/vacations/balance", {
      withCredentials: true,
    });
    // console.log("response", response)
    
    vacationBalances.value = response.data;
    
    let total = 0;
    const resultMap = {};
    response.data.forEach(item => {
      resultMap[item.vacationTypeName] = item.remainingDays;
      total += item.remainingDays;
    });

    remainingLeavesMap.value = resultMap;
    totalRemainingLeaves.value = total;
  } catch (error) {
    console.error("잔여 휴가 수 가져오기 실패:", error.response?.data || error.message);
    remainingLeavesMap.value = {};
    totalRemainingLeaves.value = 0;
  }
};


// 내 휴가 내역 API
const fetchMyVacations = async () => {
  const response = await axios.get("http://localhost:8088/api/vacations/my-vacations", {
    withCredentials: true,
  });

  const vacations = response.data;
  // console.log("vacations", vacations);

  const changed = store.getUpdatedVacations(vacations);
  changed.forEach(v => showVacationToast(v));
};

onMounted(() => {
  fetchUserInfo();
  fetchRemainingLeaves();
  fetchMyVacations();
});

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

.mypage-vacation-types {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center; 
}

.vacation-item {
  font-size: 15px;
  color: #333;
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