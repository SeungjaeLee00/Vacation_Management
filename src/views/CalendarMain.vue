<template>
  <div class="calendar-wrapper">
    <!-- <button class="vacation-button" @click="goToVacationForm">내 부서 휴가</button> -->
    <div class="calendar-container">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>

    <CalendarModal  
      v-if="showModal" 
      :selectedDate="selectedDate" 
      :selectedEvents="vacationData" 
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
import { useNotificationStore } from '@/stores/notificationStore';
import { showVacationToast } from "@/utils/showVacationToast";

const calendarRef = ref(null);
const selectedDate = ref("");
const selectedEvents = ref([]);
const showModal = ref(false);
const vacationData = ref([]);
const holidayDates = ref([]);
// const router = useRouter();

const store = useNotificationStore();

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  locale: "ko",
  locales: [koLocale],

  events: (fetchInfo, successCallback, failureCallback) => {
    const yearStart = fetchInfo.start.getFullYear();
    const monthStart = fetchInfo.start.getMonth() + 1;
    const yearEnd = fetchInfo.end.getFullYear();
    const monthEnd = fetchInfo.end.getMonth() + 1;

    // 현재 보고 있는 달 계산 (7일 더해서 현재 달로 이동)
     /*
        보고 있는 달이 3월인데, log로 찍으면 1월이라는 오류 발생
        -> fetchInfo.start는 캘린더에 보이는 "이전 달의 첫 날짜"일 수 있음
        -> 7일 더해서 "현재 달"의 날짜로 이동
      */ 
    const currentMonthDate = new Date(fetchInfo.start);
    currentMonthDate.setDate(currentMonthDate.getDate() + 7);
    const currentMonth = currentMonthDate.getMonth();
    const currentYear = currentMonthDate.getFullYear();

    // 공휴일 API
    const holidayPromise = fetch(
      `http://localhost:8088/api/holidays/get-holiday?startYear=${yearStart}&startMonth=${monthStart}&endYear=${yearEnd}&endMonth=${monthEnd}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("공휴일 조회 실패");
        return res.json();
      })
      .then((data) => {
        // console.log("공휴일API 응답 데이터:", data); 
        holidayDates.value = data.map((holiday) => holiday.holidayDate);
        return data.map((holiday) => {
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
      });

    // 내 휴가 내역 API
    const vacationPromise = fetch("http://localhost:8088/api/vacations/my-vacations", {
      // fetch는 기본 get임
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error("내 휴가 내역 조회 실패");
        return res.json();
      })
      .then((data) => {
      const updatedVacations = store.getUpdatedVacations(data);
      // 상태 변경 알림 처리
      updatedVacations.forEach(showVacationToast);

      vacationData.value = data;

      // 캘린더에선 Rejected, Cancelled 휴가 안보이게 필터링
      const filteredDataForCalendar = data.filter(
        (vacation) => vacation.status !== "REJECTED" && vacation.status !== "CANCELLED"
      );

      return filteredDataForCalendar.map((vacation) => {
        const startDate = vacation.startAt;
        const endDateObj = new Date(vacation.endAt);
        endDateObj.setDate(endDateObj.getDate() + 1);
        const endDateStr = endDateObj.toISOString().slice(0, 10);

        const startDateObj = new Date(startDate);
        const isCurrentMonth =
          startDateObj.getFullYear() === currentYear &&
          startDateObj.getMonth() === currentMonth;

        let backgroundColor = "";
        let textColor = "white";
        let borderColor = "";

        if (vacation.status === "PENDING") {
          backgroundColor = isCurrentMonth ? "#f7ed5c" : "#fcfad9";
          textColor = "#5c5121";
          borderColor = isCurrentMonth ? "#ccc44e" : "#d1c177";
        } else if (vacation.status === "APPROVED") {
          backgroundColor = isCurrentMonth ? "#6bd13f" : "#bbe0ab";
          textColor = "#1a4209";
          borderColor = isCurrentMonth ? "#5cb536" : "#7aab65";
        } 

        return {
          title: "휴가",
          start: startDate,
          end: endDateStr,
          allDay: true,
          backgroundColor,
          textColor,
          borderColor,
        };
    });
  });

    // 두 Promise 모두 완료 후 합쳐서 successCallback 호출
    Promise.all([holidayPromise, vacationPromise])
      .then(([holidayEvents, vacationEvents]) => {
        const combinedEvents = [...vacationEvents, ...holidayEvents];
        successCallback(combinedEvents);
      })
      .catch((error) => {
        console.error("이벤트 로딩 실패:", error);
        failureCallback(error);
      });
  },

  dayCellClassNames: (arg) => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, "0");
    const dayNum = String(arg.date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${dayNum}`;

    const day = arg.date.getDay();
    const classes = [];

    if (day === 0) classes.push("sunday");
    if (holidayDates.value.includes(dateStr)) classes.push("holiday");

    return classes;
  },

  height: 650,
  contentHeight: 450,
  dayMaxEvents: 2,
  dateClick: (info) => openEventModal(info.dateStr),

  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek",
  },

  windowResize: () => {
    adjustCalendarSize();
  },
});

const adjustCalendarSize = () => {
  const windowWidth = window.innerWidth;

  if (windowWidth <= 768) {
    calendarOptions.value.height = 350;
    calendarOptions.value.contentHeight = 250;
    calendarOptions.value.dayMaxEvents = 0;
    calendarOptions.value.headerToolbar = {
      left: "prev,next",
      center: "title",
      right: "",
    };
  } else {
    calendarOptions.value.height = 650;
    calendarOptions.value.contentHeight = 450;
    calendarOptions.value.dayMaxEvents = 2;
    calendarOptions.value.headerToolbar = {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek",
    };
  }
};

// console.log("vacationData", vacationData)

onMounted(() => {
  if (calendarRef.value) {
    adjustCalendarSize();
    calendarRef.value.getApi();
  }
  window.addEventListener("resize", adjustCalendarSize);
});

onUnmounted(() => {
  if (calendarRef.value) {
    calendarRef.value.getApi().destroy();
  }
  window.removeEventListener("resize", adjustCalendarSize);
});

const openEventModal = (date) => {
  selectedDate.value = date;

  // vacationData.value에서 필터링
  selectedEvents.value = vacationData.value.filter((vacation) => {
    const start = new Date(vacation.startAt);
    const end = new Date(vacation.endAt);
    const clickedDate = new Date(date);

    // end 날짜 inclusive
    return clickedDate >= start && clickedDate <= end;
  });

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
