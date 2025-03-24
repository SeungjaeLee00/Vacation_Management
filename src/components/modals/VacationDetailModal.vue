<template>
  <!-- 모달 바깥 영역 (오버레이) 클릭하면 닫히도록 설정 -->
  <div v-if="leave" class="vdm-modal-overlay" @click.self="$emit('close')">
    <div class="vdm-modal-content">
      <h3 class="vdm-modal-title">휴가 상세 정보</h3>
      <p><strong>휴가 사유:</strong> {{ leave.reason }}</p>
      <button @click="$emit('close')" class="vdm-modal-close">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leave: Object,
  },
};
</script>

<style scoped>
.vdm-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start; 
  justify-content: center;
  padding-top: 40vh; 
  z-index: 1000; /* 가장 위에 배치 */
}

/* 모달 컨텐츠 */
.vdm-modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  position: relative;
}

/* 제목 스타일 */
.vdm-modal-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}

/* 닫기 버튼 */
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
