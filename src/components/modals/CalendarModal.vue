<template>
  <div class="cm-modal-overlay" @click.self="$emit('close')">
    <div class="cm-modal-content">
      <h3>{{ formattedDate }}</h3>

      <ul v-if="filteredEvents.length > 0">
        <li v-for="(event, index) in filteredEvents" :key="index">
          {{ event.reason }}
          <ul>
            <li v-for="(used, idx) in event.usedVacations" :key="idx">
              {{ used.vacationTypeName }}: {{ used.usedDays }}일
            </li>
            ({{ event.startAt }} ~ {{ event.endAt }})
          </ul>
        </li>
      </ul>

      <p v-else>해당 일자는 휴가자가 없습니다.</p>

      <button @click="$emit('close')" class="cm-modal-close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  selectedDate: String,      
  selectedEvents: Array      
});

// selectedDate에 해당하는 휴가만 필터링
const filteredEvents = computed(() => {
  if (!props.selectedDate || !props.selectedEvents.length) return [];

  const clickedDate = new Date(props.selectedDate);

  return props.selectedEvents.filter(event => {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    return clickedDate >= start && clickedDate <= end;
  });
});

// 날짜 포맷 계산
const formattedDate = computed(() => {
  return dayjs(props.selectedDate).format('YYYY년 M월 D일');
});
</script>

  
  
<style scoped>
.cm-modal-overlay {
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

.cm-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  z-index: 11;
}

.cm-modal-content h3 {
  margin-bottom: 15px;
}

.cm-modal-content ul {
  list-style: none;
  padding: 0;
}

.cm-modal-content li {
  background: #f4f4f4;
  padding: 5px;
  margin: 5px 0;
  border-radius: 5px;
}

.cm-modal-close {
  margin-top: 10px;
  padding: 8px 12px;
  background: #2699e6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cm-modal-close:hover {
  background: #0056b3;
}
  </style>
  