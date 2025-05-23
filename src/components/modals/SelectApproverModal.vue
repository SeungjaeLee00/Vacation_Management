<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h3>결재자 선택</h3>
      <div class="searchField">
        <input v-model="searchQuery" placeholder="결재자 이름을 입력하세요" />
        <button type="button" @click="fetchApprovers">검색</button>
      </div>

      <div v-if="approvers.length > 0" class="approver-list">
        <div v-for="approver in approvers" :key="approver.employeeId">
          <label>
            <input
              type="radio"
              :value="approver"
              v-model="selectedApproverInternal"
            />
            {{ approver.departmentName }} - {{ approver.name }} {{ approver.positionName }}
          </label>
        </div>
      </div>
      <div v-else>
        <p>결과가 없습니다.</p>
      </div>

      <div class="modal-buttons">
        <button type="button" @click="confirmSelection">선택</button>
        <button type="button" @click="close">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import axios from "axios";

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue", "select"]);

const searchQuery = ref("");
const approvers = ref([]);
const selectedApproverInternal = ref(null);

const fetchApprovers = async () => {
  try {
    const response = await axios.get("http://localhost:8088/api/approvers", {
      params: { query: searchQuery.value },
      withCredentials: true,
    });
    console.log("결재자 목록", response)
    approvers.value = response.data;
  } catch (error) {
    alert("결재자 목록을 가져오지 못했습니다.");
  }
};

const confirmSelection = () => {
  if (selectedApproverInternal.value) {
    emit("select", selectedApproverInternal.value);
    emit("update:modelValue", false);
  } else {
    alert("결재자를 선택해주세요.");
  }
};

const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 20px;
  margin-bottom: 16px;
  text-align: center;
}

input[type="radio"] {
  margin-top: 8px;
}
.searchField {
  display: flex;
  justify-content: center;   /* 수평 중앙 정렬 */
  align-items: center;       /* 수직 중앙 정렬 */
  gap: 10px;
  margin: 20px 0;
}

.searchField input {
  height: 48px;              /* 높이 크게 */
  font-size: 16px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #2699e6;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 8px;
}

.approver-list {
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.approver-list label {
  display: block;
  margin-bottom: 8px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

