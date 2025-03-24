<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">휴가 신청 내역</h2>

    <!-- 필터 영역 -->
    <div class="filter-container">
      <input v-model="searchText" type="text" placeholder="검색어 입력..." class="filter-input" />
      <select v-model="selectedStatus" class="filter-select">
        <option value="">전체 상태</option>
        <option value="approved">승인됨</option>
        <option value="pending">대기 중</option>
        <option value="rejected">거절됨</option>
      </select>
      <button @click="resetFilters" class="filter-reset-btn">초기화</button>
    </div>

    <!-- 휴가 신청 목록 (페이지네이션 적용) -->
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">신청 날짜</th>
          <th class="border p-2">휴가 종류</th>
          <th class="border p-2">시작일</th>
          <th class="border p-2">종료일</th>
          <th class="border p-2">상태</th>
          <th class="border p-2">상세</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leave in paginatedLeaves" :key="leave.id" class="border">
          <td class="border p-2">{{ leave.requestDate }}</td>
          <td class="border p-2">{{ leave.type }}</td>
          <td class="border p-2">{{ leave.startDate }}</td>
          <td class="border p-2">{{ leave.endDate }}</td>
          <td class="border p-2">{{ leave.status }}</td>
          <td class="border p-2 text-center">
            <button @click="viewDetails(leave)" class="bg-blue-500 text-white p-1 rounded">보기</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <VuePagination 
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-changed="currentPage = $event"
    />

    <!-- 상세 모달 -->
    <VacationDetailModal v-if="selectedLeave" :leave="selectedLeave" @close="selectedLeave = null" />
  </div>
</template>

<script>
import VuePagination from "@/components/VuePagination.vue";
import VacationDetailModal from "@/components/modals/VacationDetailModal.vue";


export default {
  components: { VuePagination, VacationDetailModal },
  data() {
    return {
      searchText: "",
      selectedStatus: "",
      selectedLeave: null,
      currentPage: 1,
      itemsPerPage: 5,
      leaves: [
      { id: 1, requestDate: "2025-03-20", type: "연차", startDate: "2025-04-01", endDate: "2025-04-02", status: "승인됨", reason: "가족 여행" },
      { id: 2, requestDate: "2025-03-21", type: "하계휴가", startDate: "2025-06-10", endDate: "2025-06-12", status: "대기 중", reason: "개인 사유" },
      { id: 3, requestDate: "2025-03-22", type: "대체 휴가", startDate: "2025-05-05", endDate: "2025-05-06", status: "거절됨", reason: "건강 문제" },
      { id: 4, requestDate: "2025-03-23", type: "포상 휴가", startDate: "2025-07-01", endDate: "2025-07-02", status: "승인됨", reason: "우수 성과 보상" },
      { id: 5, requestDate: "2025-03-24", type: "연차", startDate: "2025-08-01", endDate: "2025-08-02", status: "대기 중", reason: "친구 결혼식 참석" },
      { id: 6, requestDate: "2025-03-25", type: "하계휴가", startDate: "2025-09-10", endDate: "2025-09-12", status: "승인됨", reason: "여름 휴가" },
      ],
    };
  },
  computed: {
    filteredLeaves() {
      return this.leaves.filter(leave => 
        (this.searchText === "" || leave.type.includes(this.searchText)) &&
        (this.selectedStatus === "" || leave.status === this.selectedStatus)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredLeaves.length / this.itemsPerPage);
    },
    paginatedLeaves() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredLeaves.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    viewDetails(leave) {
      this.selectedLeave = leave;
    },
  },
};
</script>


<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  justify-content: center; 
  gap: 10px;
  margin-bottom: 16px;
}

.filter-input, .filter-select {
  border: 1px solid #d1d5db;
  padding: 8px;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-input:focus, .filter-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
}

.filter-reset-btn {
  background-color: #6b7280; 
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.filter-reset-btn:hover {
  background-color: #4b5563; 
}

table {
  width:95%;
  justify-self: center;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top:20px;
}

th {
  background: #2699e6;
  color: white;
  padding: 12px;
}

td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

tr:nth-child(odd) {
  background: #f9f9f9;
}

tr:hover {
  background: #f1f1f1;
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

button.bg-blue-500 {
  background: #2699e6;
  color: white;
}

button.bg-blue-500:hover {
  background: #357ac7;
}
</style>

