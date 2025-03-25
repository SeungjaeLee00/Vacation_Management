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
  // import dayjs from "dayjs";

  const calendarRef = ref(null);
  const selectedDate = ref("");
  const selectedEvents = ref([]);
  const showModal = ref(false);

  const events = ref([
    // { title: "이승재 휴가", start: "2025-03-01" },
    // { title: "이승재 휴가", start: "2025-03-01" },
    // { title: "이승재 휴가", start: "2025-03-01" },
    // { title: "이승재 휴가", start: "2025-03-04" },
    // { title: "이승재 휴가", start: "2025-03-04" },
    // { title: "이승재 휴가", start: "2025-03-04" },
    // { title: "이승재 휴가", start: "2025-03-04" },
    // { title: "이승재 휴가", start: "2025-03-13" },
    // { title: "이승재 휴가", start: "2025-03-13" },
    // { title: "이승재 휴가", start: "2025-03-13" },
    // { title: "이승재 휴가", start: "2025-03-20" },
    // { title: "이승재 휴가", start: "2025-03-20" },
    // { title: "이승재 휴가", start: "2025-03-20" },
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-31" },
    // { title: "이승재 휴가", start: "2025-03-31" },
    // { title: "이승재 휴가", start: "2025-03-31" },
  ]);

  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: "ko",
    locales: [koLocale],
    events: events.value,
    height: 650, // FullCalendar 전체 높이 
    contentHeight: 450, // 내부 콘텐츠 
    dayMaxEvents: 2,  // 같은 날에 2개까지만 표시하고, 초과 시 "+더보기" 버튼 자동 생성(FullCalendar에서 기본적으로 제공하는 기능)
    dateClick: (info) => openEventModal(info.dateStr),
    headerToolbar: { // 달력의 상단 툴바 설정
      left: 'prev,next today',
      center: 'title',         
      right: 'dayGridMonth,dayGridWeek' 
  },
   // 반응형을 위한 추가 옵션
   windowResize: function() {
    adjustCalendarSize();
  },
  });

  // 반응형 설정을 위한 계산된 값
  const adjustCalendarSize = () => {
    const windowWidth = window.innerWidth;

    // 화면이 768px 이하일 경우
    if (windowWidth <= 768) {
      calendarOptions.value.height = 350; // 높이 줄이기
      calendarOptions.value.contentHeight = 250; // 콘텐츠 높이 줄이기
      calendarOptions.value.dayMaxEvents = 0;  // 더 적은 이벤트 표시, "+더보기" 버튼 바로 보이게
      calendarOptions.value.headerToolbar = {
        left: 'prev,next', 
        center: 'title',  
        right: ''          // 우측 버튼 없애기
    };
    } else {
      // 기본 크기로 설정
      calendarOptions.value.height = 650;
      calendarOptions.value.contentHeight = 450;
      calendarOptions.value.dayMaxEvents = 2;
      calendarOptions.value.headerToolbar = { // 기본 툴바
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek'
    };
    }
  };

  onMounted(() => {
    // FullCalendar 초기화 및 반응형 설정 적용
    if (calendarRef.value) {
      adjustCalendarSize(); // 화면 크기에 맞는 초기화
      calendarRef.value.getApi(); 
    }

    // 화면 크기 변경 시마다 적용
    window.addEventListener('resize', adjustCalendarSize);
  });

  onUnmounted(() => {
    // FullCalendar 인스턴스를 제거
    if (calendarRef.value) {
      calendarRef.value.getApi().destroy();
    }
  });

  // 리스너 정리
  window.removeEventListener('resize', adjustCalendarSize);

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
    width: 90vw;
    max-width: 1000px;
    padding: 10px;
    position: relative;
    z-index: 1;
  }

  /* FullCalendar 크기 줄이기 */
  :deep(.fc) {
    font-size: 15px;
  }

  @media(max-width: 768px){
    :deep(.fc) {
      font-size: 11px;
    }
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
