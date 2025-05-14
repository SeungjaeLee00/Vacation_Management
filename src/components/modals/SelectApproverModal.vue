<!-- components/SelectApproverModal.vue -->
<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h3>결재자 선택</h3>
      <div class="flex items-center gap-2">
        <input v-model="searchQuery" placeholder="결재자 이름을 입력하세요" />
        <button @click="fetchApprovers">검색</button>
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
        <button @click="confirmSelection">선택</button>
        <button @click="close">닫기</button>
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
