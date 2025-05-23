<template>
  <div class="cm-modal-overlay" @click.self="$emit('close')">
    <div class="cm-modal-content">
      <h3>{{ formattedDate }}</h3>

      <ul v-if="filteredEvents.length > 0">
        <li v-for="(event, index) in filteredEvents" :key="index" style="margin-bottom: 15px;">
          <!-- <p><strong>휴가 상태:</strong> {{ event.status }}</p> -->
          <ul>
            <li class="cm-modal-content-details" v-for="(used, idx) in event.usedVacations" :key="idx">
              {{ used.vacationTypeName }}: {{ used.usedDays.toFixed(2) }}일
              <template v-if="used.startTime && used.endTime">
                ({{ used.startTime }} ~ {{ used.endTime }})
              </template>
            </li>
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

// 선택한 날짜에 해당하는 휴가만 필터링
const filteredEvents = computed(() => {
  if (!props.selectedDate || !props.selectedEvents.length) return [];

  const clickedDate = new Date(props.selectedDate);

  return props.selectedEvents.filter(event => {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    
    // rejected 상태인 휴가는 모달 안 보이게
    return event.status !== 'REJECTED' && event.status !== 'CANCELLED' && event.status !== 'DELETED' && clickedDate >= start && clickedDate <= end;
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
  text-align: left;
}

.cm-modal-content ul li {
  font-size: 1rem;
}

.cm-modal-content-details {
  list-style: disc inside;
  margin: 5px 0;
  border-radius: 5px;
  text-align: left;
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
  