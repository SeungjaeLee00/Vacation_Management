<template>
  <div class="calendar-wrapper">
    <div class="calendar-container">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

const calendarRef = ref(null);
const vacationData = ref([]);
const holidayDates = ref([]);

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

    // 내 부서 휴가 내역 API
    const vacationPromise = fetch("http://localhost:8088/api/vacations/my-department", {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error("내 부서 휴가 조회 실패");
        return res.json();
      })
      .then((data) => {
        // 응답이 배열인지 확인
        if (!Array.isArray(data.data)) {
          throw new Error("응답 데이터가 배열이 아닙니다");
        }

        return fetch("http://localhost:8088/api/user/me", {
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) throw new Error("로그인 정보 조회 실패");
            return res.json();
          })
          .then((userInfo) => {
            const loggedInUserId = userInfo.name; // 로그인한 사용ㅈ나의 이름름

            // 로그인한 유저의 휴가를 제외
            const filteredVacations = data.data.filter((vacation) => vacation.userName !== loggedInUserId);

            vacationData.value = filteredVacations;

            // 캘린더에 보여줄 이벤트 데이터 반환
            return filteredVacations.map((vacation) => {
              const startDate = vacation.start_at;
              const endDateObj = new Date(vacation.end_at);
              endDateObj.setDate(endDateObj.getDate() + 1);
              const endDateStr = endDateObj.toISOString().slice(0, 10);

              const startDateObj = new Date(startDate);
              const isCurrentMonth =
                startDateObj.getFullYear() === currentYear &&
                startDateObj.getMonth() === currentMonth;

              return {
                title: vacation.userName + " " +vacation.positionName, // 휴가 신청자의 이름, 직급
                start: startDate,
                end: endDateStr,
                allDay: true,
                backgroundColor: isCurrentMonth ? "#6bd13f" : "#bbe0ab",
                textColor: "#1a4209", 
                borderColor: isCurrentMonth ? "#5cb536" : "#7aab65",
              };
            });
          });
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });

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

  :deep(.fc) {
    font-size: 15px;
  }

  @media(max-width: 768px){
    :deep(.fc) {
      font-size: 11px;
    }
  }
</style>
