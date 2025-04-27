<template>
  <div class="vacation-form-container">
    <h2>휴가 신청</h2>
    <form @submit.prevent="submitVacation">
      <label for="date-picker">휴가 날짜</label>
      <input id="date-picker" type="text" placeholder="날짜를 선택하세요" required />

      <label>휴가 종류 및 사용 일수</label>
      <div v-for="type in vacationTypes" :key="type" class="vacation-type-row">
        <label>
          <input type="checkbox" v-model="selectedVacationTypes" :value="type" />
          {{ type }}
        </label>
        <input
          type="number"
          min="0"
          v-model.number="usedDaysByType[type]"
          :disabled="!selectedVacationTypes.includes(type)"
          placeholder="사용 일수"
          required
        />
      </div>

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
import { Korean } from "flatpickr/dist/l10n/ko.js";

const router = useRouter();
const vacationDate = ref([]);
const reason = ref("");
const vacationTypes = ref(["연차", "하계휴가", "대체휴가", "포상휴가"]);
const selectedVacationTypes = ref([]);
const usedDaysByType = ref({
  "연차": 0,
  "하계휴가": 0,
  "대체휴가": 0,
  "포상휴가": 0,
});

const submitVacation = async () => {
  if (vacationDate.value.length === 0) {
    alert("휴가 날짜를 선택해주세요.");
    return;
  }
  if (selectedVacationTypes.value.length === 0) {
    alert("휴가 종류를 최소 1개 선택해주세요.");
    return;
  }

  try {
    const usedVacations = selectedVacationTypes.value.map((type) => {
      const usedDays = usedDaysByType.value[type];
      if (!usedDays || usedDays <= 0) {
        throw new Error(`${type} 휴가의 사용 일수를 1일 이상 입력해주세요.`);
      }
      return { vacationTypeName: type, usedDays };
    });

    const vacationData = {
      startAt: vacationDate.value[0],
      endAt: vacationDate.value[vacationDate.value.length - 1],
      usedVacations,
      reason: reason.value,
    };

    await axios.post("http://localhost:8088/api/vacations/request", vacationData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("Token")}`,
      },
      withCredentials: true,
    });
    alert("휴가 신청이 완료되었습니다!");
    router.push("/home");
  } catch (error) {
    alert(error.message || "휴가 신청에 실패했습니다. 다시 시도해주세요.");
  }
};

const cancel = () => {
  vacationDate.value = [];
  reason.value = "";
  selectedVacationTypes.value = [];
  usedDaysByType.value = {
    "연차": 0,
    "하계휴가": 0,
    "대체휴가": 0,
    "포상휴가": 0,
  };
  router.push("/home");
};

onMounted(() => {
  flatpickr("#date-picker", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: Korean,
    onChange: (selectedDates) => {
      vacationDate.value = selectedDates.map((date) => date.toISOString().split("T")[0]);
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

.vacation-type-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.vacation-type-row label {
  flex: 1; 
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.vacation-type-row input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2); 
}

.vacation-type-row input[type="number"] {
  width: 80px;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  transition: border-color 0.2s ease;
}

.vacation-type-row input[type="number"]:focus {
  border-color: #409eff; 
  outline: none;
}

.vacation-type-row input[type="number"]:disabled {
  background-color: #f5f5f5;
  border-color: #ddd;
  cursor: not-allowed;
}

</style>
