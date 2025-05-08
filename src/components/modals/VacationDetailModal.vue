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

      <!-- 대기 중인 상태의 휴가만 휴가 취소 보임임 -->
      <button v-if="leave.status === 'PENDING'" @click="confirmCancelVacation" class="vdm-modal-cancel-btn">
        휴가 취소
      </button>

      <!-- 취소한 상태의 휴가만 휴가 삭제 보임임 -->
      <button v-if="leave.status === 'CANCELLED'" @click="confirmDeleteVacation" class="vdm-modal-delete-btn">
        휴가 삭제
      </button>

      <button @click="$emit('close')" class="vdm-modal-close">X</button>
    </div>
  </div>
</template>


<script>
import axios from 'axios'; 

export default {
  props: {
    leave: Object,  // props
    showModal: Boolean,  // 모달 열려있는지 여부
  },

  methods: {
    async confirmCancelVacation() {
      if (confirm("휴가를 취소하시겠습니까?")) {
        try {
          await axios.delete(
            `http://localhost:8088/api/vacations/${this.leave.id}/cancel`,
            { withCredentials: true }
          );
          alert("휴가가 취소되었습니다.");
          this.$emit("close");
          window.location.reload();
        } catch (error) {
          console.error("휴가 취소 실패:", error);
          alert("휴가 취소에 실패했습니다.");
        }
      }
    },

    async confirmDeleteVacation() {
      if (confirm("이 휴가를 정말 삭제하시겠습니까? 복구할 수 없습니다.")) {
        try {
          await axios.delete(
            `http://localhost:8088/api/vacations/${this.leave.id}/delete`,
            { withCredentials: true }
          );
          alert("휴가가 삭제되었습니다.");
          this.$emit("close");
          window.location.reload();
        } catch (error) {
          console.error("휴가 삭제 실패:", error);
          alert("휴가 삭제에 실패했습니다.");
        }
      }
    },
    
    closeModal() {
      this.$emit('close'); // 모달을 닫는 이벤트를 부모에게 전달
    }
  }
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
  position: relative;
  padding: 20px 30px 80px 30px;
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

.vdm-modal-cancel-btn, 
.vdm-modal-delete-btn {
  position: absolute; 
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 30px; 
  padding: 8px 12px;
  background: #dd7d7d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.vdm-modal-cancel-btn:hover, 
.vdm-modal-delete-btn:hover {
  background: #f87676;
}

.vdm-modal-close {
  position: absolute; 
  font-size: 20px;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background: none;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.vdm-modal-close:hover {
  background: none;
}
</style>
