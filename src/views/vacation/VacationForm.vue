<template>
    <div class="vacation-form-container">
      <h2>휴가 신청</h2>
      <form @submit.prevent="submitVacation">
        <!-- <label for="date">휴가 날짜</label> -->
        <!-- <input type="date" id="date" v-model="vacationDate" required />  단일 날자 선택 -->
        <label for="date-picker">휴가 날짜</label>
        <input id="date-picker" type="text" placeholder="날짜를 선택하세요" required />

        <!-- 드롭다운 추가 -> 휴가 종류 선택 -->
        <label for="leave-type">휴가 종류</label>
        <select id="leave-type" v-model="selectedLeaveType" required>
          <option disabled value="">휴가 종류 선택</option>
          <option v-for="type in leaveTypes" :key="type" :value="type">{{ type }}</option>
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
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Korean } from "flatpickr/dist/l10n/ko.js"

const router = useRouter();

// const vacationDate = ref("");
const vacationDate = ref([]); // 여러 날짜 선택 가능
const reason = ref("");

// 휴가 신청 핸들러 -> 나중에 여기 API 추가
const submitVacation = () => {
  console.log("휴가 신청 날짜:", vacationDate.value);
  console.log("휴가 종류:", selectedLeaveType.value);
  console.log("휴가 사유:", reason.value);
  alert("휴가 신청이 완료되었습니다!"); // 테스트용
  router.push("/home"); 
};

const cancel = () => {
    vacationDate.value = [];
    reason.value = "";
    router.push("/home");
};

const selectedLeaveType = ref("");
const leaveTypes = ref(["연차", "하계휴가", "대체 휴가", "포상 휴가"]);


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
