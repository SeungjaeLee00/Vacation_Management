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

  /* 모달 컨텐츠 */
  .vdm-modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    z-index: 11;
  }

  /* 제목 스타일 */
  .vdm-modal-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
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
