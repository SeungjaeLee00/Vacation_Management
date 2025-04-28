<template>
  <!-- 모달 바깥 영역 (오버레이) 클릭하면 닫히도록 설정 -->
  <div v-if="leave" class="vdm-modal-overlay" @click.self="$emit('close')">
    <div class="vdm-modal-content">
      <h3 class="vdm-modal-title">휴가 상세 정보</h3>
      <p><strong>휴가 사유:</strong> {{ leave.reason }}</p>
      <ul>
        <li v-for="(used, index) in leave.usedVacations" :key="index">
          {{ used.vacationTypeName }}: {{ used.usedDays }}일
          <template v-if="used.startTime && used.endTime">
            ({{ used.startTime }} ~ {{ used.endTime }})
          </template>
        </li>
      </ul>
      <button @click="$emit('close')" class="vdm-modal-close">닫기</button>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    leave: Object,
  },
  // mounted() {
  //   console.log('leave prop:', this.leave);
  // }
};
</script>


<style scoped>

.vdm-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.vdm-modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.vdm-modal-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 1.5rem;
  text-align: center;
}

.vdm-modal-content p {
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.vdm-modal-content ul {
  list-style: disc inside;
  padding-left: 0;
  margin: 0 0 20px 0;
}

.vdm-modal-content ul li {
  margin-bottom: 8px;
  font-size: 1rem;
}

.vdm-modal-close {
  margin-top: 10px;
  padding: 8px 12px;
  background: #2699e6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.vdm-modal-close:hover {
  background: #0056b3;
}

</style>
