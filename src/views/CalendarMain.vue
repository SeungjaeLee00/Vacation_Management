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
    { title: "0뫄뫄 휴가", start: "2025-03-27" },
    { title: "1뫄뫄 휴가", start: "2025-03-27" },
    { title: "2뫄뫄 휴가", start: "2025-03-27" },
    { title: "3뫄뫄 휴가", start: "2025-03-27" },
    { title: "4뫄뫄 휴가", start: "2025-03-27" },
  ]);

  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: "ko",
    locales: [koLocale],
    events: events.value,
    height: 550, // FullCalendar 전체 높이 
    contentHeight: 450, // 내부 콘텐츠 
    dayMaxEvents: 2,  // 같은 날에 2개까지만 표시하고, 초과 시 "+더보기" 버튼 자동 생성(FullCalendar에서 기본적으로 제공하는 기능)
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
</style>
