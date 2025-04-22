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
    // 기존 이벤트는 따로 저장해서 공휴일과 결합할 예정  
    // DB 연동X, 더미 데이터터
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-25" },
    // { title: "이승재 휴가", start: "2025-03-25" },
  ]);

  const holidayDates = ref([]); // 'YYYY-MM-DD' 형식

  const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: "ko",
    locales: [koLocale],

    // 여기에 공휴일 넣을거임
    // events: events.value,  
    events: (fetchInfo, successCallback, failureCallback) => {
      const yearStart = fetchInfo.start.getFullYear();
      const monthStart = fetchInfo.start.getMonth() + 1; 
      const yearEnd = fetchInfo.end.getFullYear();
      const monthEnd = fetchInfo.end.getMonth() + 1;

      // console.log(`공휴일 요청: ${yearStart}년 ${monthStart}월 ~ ${yearEnd}년 ${monthEnd}월`);

      const currentMonthDate = new Date(fetchInfo.start);
      /*
        보고 있는 달이 3월인데, log로 찍으면 1월이라는 오류 발생
        -> fetchInfo.start는 캘린더에 보이는 "이전 달의 첫 날짜"일 수 있음
        -> 7일 더해서 "현재 달"의 날짜로 이동
      */ 
      currentMonthDate.setDate(currentMonthDate.getDate() + 7); 

      const currentMonth = currentMonthDate.getMonth();
      const currentYear = currentMonthDate.getFullYear();

      // console.log(`현재 보고 있는 달: ${currentYear}년 ${currentMonth + 1}월`);

      // 시작 날짜와 끝 날짜를 파라미터로 보내기
      fetch(`http://localhost:8088/api/holidays/get-holiday?startYear=${yearStart}&startMonth=${monthStart}&endYear=${yearEnd}&endMonth=${monthEnd}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log("공휴일", data);

          holidayDates.value = data.map((holiday) => holiday.holidayDate); // 공휴일 날짜 저장

          const holidayEvents = data.map((holiday) => {
          const holidayDate = new Date(holiday.holidayDate);
          const isCurrentMonth =
            holidayDate.getMonth() === currentMonth &&
            holidayDate.getFullYear() === currentYear;

            return {
              title: holiday.name,
              start: holiday.holidayDate,
              allDay: true,
              backgroundColor: isCurrentMonth ? "#ff6666" : "#ffe5e5",
              textColor: isCurrentMonth ? "white" : "#944",
              borderColor: isCurrentMonth ? "#ff4444" : "#f5aaaa",
        };
      });

          // 기존 휴가 이벤트를 포함한 새로운 이벤트 배열 생성
          const combinedEvents = [...events.value, ...holidayEvents];
          successCallback(combinedEvents);
        })
        .catch((error) => {
          console.error("공휴일 로딩 실패:", error);
          failureCallback(error);
        });
    },

    // 숫자 빨간날 표시: 일요일, 공휴일일
    dayCellClassNames: (arg) => {
      const year = arg.date.getFullYear();
      const month = String(arg.date.getMonth() + 1).padStart(2, '0');
      const dayNum = String(arg.date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`; 

      const day = arg.date.getDay();
      const classes = [];

      if (day === 0) {
        classes.push("sunday");
      }

      if (holidayDates.value.includes(dateStr)) {
        classes.push("holiday");
      }

      return classes;
    },

    height: 650, // FullCalendar 전체 높이 
    contentHeight: 450, // 내부 콘텐츠 
    dayMaxEvents: 2,  // 같은 날에 2개까지만 표시하고, 초과 시 "+더보기" 버튼 자동 생성(FullCalendar에서 기본적으로 제공하는 기능)
    dateClick: (info) => openEventModal(info.dateStr),

    // 달력의 상단 툴바 설정
    headerToolbar: { 
      left: 'prev,next today',
      center: 'title',         
      right: 'dayGridMonth,dayGridWeek' 
    },

    // 반응형을 위한 추가 옵션
    windowResize: function() {
      adjustCalendarSize();
    },
  });

  // 반응형 설정
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

  :deep(.sunday .fc-daygrid-day-number),
  :deep(.holiday .fc-daygrid-day-number) {
  color: red !important;
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
