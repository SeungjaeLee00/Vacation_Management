<template>
  <div class="calendar-wrapper">
    <!-- <button class="vacation-button" @click="goToVacationForm">+ 휴가 신청</button> -->
    <div class="calendar-container">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>

    <!-- 모달 컴포넌트 사용 -->
    <CalendarModal  
      v-if="showModal" 
      :selectedDate="selectedDate" 
      :selectedEvents="selectedEvents" 
      @close="closeModal" 
    />
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import CalendarModal from "@/components/modals/CalendarModal.vue"; 

const calendarRef = ref(null);
const selectedDate = ref("");
const selectedEvents = ref([]);
const showModal = ref(false);

const events = ref([
  { title: "이승재 휴가", start: "2025-03-25" },
  { title: "홍길동 휴가", start: "2025-03-27" },
  { title: "김철수 휴가", start: "2025-03-27" },
]);

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "ko",
  locales: [koLocale],
  events: events.value,
  height: 550, // FullCalendar 전체 높이 
  contentHeight: 450, // 내부 콘텐츠 
  dateClick: (info) => openEventModal(info.dateStr),
});

onMounted(() => {
  if (calendarRef.value) {
    console.log("FullCalendar Mounted:", calendarRef.value.getApi());
  }
});

onUnmounted(() => {
  if (calendarRef.value) {
    calendarRef.value.getApi().destroy();
  }
});

const openEventModal = (date) => {
  selectedDate.value = date;
  selectedEvents.value = events.value.filter((event) => event.start === date);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.calendar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 20px;
}

.calendar-container {
  width: 100vw;
  max-width: 1000px;
  background: white;
  padding: 10px;
  position: relative;
  z-index: 1;
}

/* FullCalendar 크기 줄이기 */
:deep(.fc) {
  font-size: 14px;
}

/* .vacation-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  padding: 12px 18px;
  font-size: 16px;
  background-color: #2699e6;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.vacation-button:hover {
  background-color: #0056b3;
} */


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  z-index: 11;
}

.modal h3 {
  margin-bottom: 10px;
}

.modal ul {
  list-style: none;
  padding: 0;
}

.modal li {
  background: #f4f4f4;
  padding: 5px;
  margin: 5px 0;
  border-radius: 5px;
}

.modal button {
  margin-top: 10px;
  padding: 8px 12px;
  background: #2699e6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal button:hover {
  background: #0056b3;
}
</style>
