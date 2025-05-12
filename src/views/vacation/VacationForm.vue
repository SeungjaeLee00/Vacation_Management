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
          min="0.25"
          step="0.25"
          v-model.number="usedDaysByType[type]"
          :disabled="!selectedVacationTypes.includes(type)"
          placeholder="사용 일수"
          required
        />

        <!-- 1일 미만이면 시간 선택 UI 보이게 -->
        <div v-if="usedDaysByType[type] > 0 && usedDaysByType[type] < 1" class="time-inputs">
          <label>시작 시간</label>
          <input type="time" v-model="startTimes[type]" />
          <label>종료 시간</label>
          <input type="time" v-model="endTimes[type]" />
        </div>

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
import { ref, onMounted, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import dayjs from 'dayjs';

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

const router = useRouter();
const vacationDate = ref([]);
const startTimes = reactive({});
const endTimes = reactive({});
const reason = ref("");
const vacationTypes = ref(["연차", "하계휴가", "대체휴가", "포상휴가"]);
const selectedVacationTypes = ref([]);
const usedDaysByType = ref({
  "연차": 0,
  "하계휴가": 0,
  "대체휴가": 0,
  "포상휴가": 0,
});
const vacationBalances = ref([]);  // 잔여 휴가 수량을 저장할 변수

// 휴가 잔여 수량 가져오기
const fetchVacationBalances = async () => {
  try {
    const response = await axios.get("http://localhost:8088/api/vacations/balance", {
      withCredentials: true,
    });
    vacationBalances.value = response.data;
    // console.log(vacationBalances.value);
  } catch (error) {
    alert("휴가 잔여 수량을 불러오는데 실패했습니다.");
  }
};


// 휴가 신청
const submitVacation = async () => {
  if (vacationDate.value.length === 0) {
    alert("휴가 날짜를 선택해주세요.");
    return;
  }
  if (selectedVacationTypes.value.length === 0) {
    alert("휴가 종류를 최소 1개 선택해주세요.");
    return;
  }

  // 휴가 종류별 잔여 수량 확인
  for (const type of selectedVacationTypes.value) {
    const vacationBalance = vacationBalances.value.find(v => v.vacationTypeName === type);
    const usedDays = usedDaysByType[type];

    if (!vacationBalance || vacationBalance.remainingDays < usedDays) {
      alert(`${type} 휴가가 부족합니다. 남은 일수는 ${vacationBalance ? vacationBalance.remainingDays : 0}일입니다.`);
      return;  // 부족하면 바로 리턴
    }
  }

  try {
    const usedVacations = selectedVacationTypes.value.map((type) => {
      const usedDays = usedDaysByType.value[type];
      if (!usedDays || usedDays < 0.25) {
        throw new Error(`${type} 휴가의 사용 일수를 0.25일 이상 입력해주세요.`);
      }
      return {
        vacationTypeName: type,
        usedDays,
        startTime: startTimes[type] || null,
        endTime: endTimes[type] || null,
      };
    });

    /* 
    프론트에서 선택된 날짜가 실제로 하루 땡겨져서 저장되는 문제 발생
      -> 날짜 +1 하는 거로 하드코딩함.. 근데 이건 임시임. 다시 방법 생각해야 함. 타임존 문젠가ㅜㅜ
    */
    const startAt = dayjs(vacationDate.value[0]).add(1, 'day').format('YYYY-MM-DD');
    const endAt = dayjs(vacationDate.value[vacationDate.value.length - 1]).add(1, 'day').format('YYYY-MM-DD');

    const vacationData = {
      startAt,
      endAt,
      usedVacations,
      reason: reason.value,
    };
    
    // 휴가 신청 API
    await axios.post("http://localhost:8088/api/vacations/request", vacationData, {
      withCredentials: true,
    });
    alert("휴가 신청이 완료되었습니다!");
    router.push("/home");
  } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // console.log("error.response.data.message", error.response.data.message)
      alert(error.response.data.message);
    } else {
      alert('알 수 없는 오류가 발생했습니다.');
    }
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
  fetchVacationBalances();
});

// watch로 selectedVacationTypes 감시하기~
watch(selectedVacationTypes, (newVal, oldVal) => {
  // 새로 추가된 휴가 타입에 대해서만 usedDaysByType 값을 0.25로 세팅
  const addedTypes = newVal.filter((type) => !oldVal.includes(type));
  addedTypes.forEach((type) => {
    if (usedDaysByType.value[type] === 0) {
      usedDaysByType.value[type] = 0.25;
    }
  });

  // 체크 해제된 휴가 타입은 0으로 초기화
  const removedTypes = oldVal.filter((type) => !newVal.includes(type));
  removedTypes.forEach((type) => {
    usedDaysByType.value[type] = 0;
  });
});
</script>

<style scoped>
.vacation-form-container {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
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
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
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

.time-inputs {
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-left: 24px;
  margin-top: 6px;
}

.time-inputs label {
  font-size: 13px;
  color: #555;
}

.time-inputs input[type="time"] {
  padding: 3px 6px;
  font-size: 14px;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
