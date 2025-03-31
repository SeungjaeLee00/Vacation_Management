<template>
    <div class="vacation-form-container">
      <h2>휴가 신청</h2>
      <form @submit.prevent="submitVacation">
        <label for="date-picker">휴가 날짜</label>
        <input id="date-picker" type="text" placeholder="날짜를 선택하세요" required />

        <label for="leave-type">휴가 종류</label>
        <select id="leave-type" v-model="selectedvacationType" required>
          <option disabled value="">휴가 종류 선택</option>
          <option v-for="type in vacationType" :key="type" :value="type">{{ type }}</option>
        </select>
  
        <label for="reason">휴가 사유</label>
        <textarea id="reason" v-model="reason" placeholder="사유를 입력하세요." required></textarea>
  
        <div class="button-group">
          <button type="submit" class="submit-btn">등록</button>
          <button type="button" class="cancel-btn" @click="cancel">취소</button>
        </div>
      </form>
    </div>
  </template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Cookies from "js-cookie";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Korean } from "flatpickr/dist/l10n/ko.js"

const router = useRouter();
const vacationDate = ref([]); // 여러 날짜 선택 가능
const reason = ref("");
const selectedvacationType = ref("");
const vacationType = ref(["연차", "하계휴가", "대체 휴가", "포상 휴가"]);

// 휴가 신청 핸들러 
const submitVacation = async () => {
  const vacationData = {
    vacationDates: vacationDate.value,
    vacationType: selectedvacationType.value,
    reason: reason.value,
  };

  try {
    // 서버로 API 요청 (JWT 토큰을 헤더에 포함)
    // const response = await axios.post("http://localhost:8088/api/vacations/request", vacationData, {
    await axios.post("http://localhost:8088/api/vacations/request", vacationData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("Token")}`, 
      },
      withCredentials: true,
    });

    // console.log("휴가 신청 결과:", response.data);
    alert("휴가 신청이 완료되었습니다!");
    router.push("/home"); 
  } catch (error) {
    // console.error("휴가 신청 오류:", error.response ? error.response.data : error.message);
    alert("휴가 신청에 실패했습니다. 다시 시도해주세요."); 
  }
};

const cancel = () => {
    vacationDate.value = [];
    reason.value = "";
    router.push("/home");
};


onMounted(() => {
  flatpickr("#date-picker", {
    mode: "range", // 여러 날 선택 가능 (range 모드)
    dateFormat: "Y-m-d",
    locale: Korean, 
    onChange: (selectedDates) => {
      vacationDate.value = selectedDates.map((date) =>
        date.toISOString().split("T")[0]
      );
    },
  });
});
</script>

<style scoped>
.vacation-form-container {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;

  /* background: #fff; */
  /* border-radius: 8px; */
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap:10px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

select {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  /* font-size: 14px; */
  cursor: pointer;
}


input,
textarea {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: none;
  height: 100px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px;
  width: 48%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn {
  background-color: #2699e6;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.cancel-btn {
  background-color: #ccc;
  
}

.cancel-btn:hover {
  background-color: #999;
}
</style>
