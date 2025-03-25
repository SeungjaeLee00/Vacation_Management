<template>
  <div class="vacation-container">
    <div class="vacation-list">
      <h2 class="vacation-list-title">휴가 신청 내역</h2>

      <!-- 필터 영역 -->
       <!-- 제대로 구현X, 나중에 자세히 구현해야 함 -->
      <div class="vacation-list-filter-container">
        <input v-model="searchText" type="text" placeholder="검색어 입력..." class="vacation-list-filter-input" />
        <select v-model="selectedStatus" class="vacation-list-filter-select">
          <option value="">전체 상태</option>
          <option value="approved">승인됨</option>
          <option value="pending">대기 중</option>
          <option value="rejected">거절됨</option>
        </select>
        <button @click="resetFilters" class="vacation-list-filter-reset-btn">초기화</button>
      </div>

      <!-- 휴가 신청 목록 (페이지네이션 적용) -->
      <table class="vacation-list-table">
        <thead>
          <tr>
            <th>신청 날짜</th>
            <th>휴가 종류</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>상태</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="leave in paginatedLeaves" :key="leave.id">
            <td>{{ leave.requestDate }}</td>
            <td>{{ leave.type }}</td>
            <td>{{ leave.startDate }}</td>
            <td>{{ leave.endDate }}</td>
            <!-- <td>{{ leave.status }}</td> -->
            <td :class="statusClass(leave.status)">{{ leave.status }}</td>
            <td class="vacation-list-text-center">
              <button @click="viewDetails(leave)" class="vacation-list-detail-btn">보기</button>
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
    </div>

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
        // 더미
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
      statusClass(status) {
        if (status === "승인됨") return "status-approved";
        if (status === "대기 중") return "status-pending";
        if (status === "거절됨") return "status-rejected";
        return "";
      },
    },
  };
</script>


<style scoped>
  .vacation-list-title{
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-top:50px;
      text-align: center;
  }

  .vacation-list-filter-container {
    display: flex;
    align-items: center;
    justify-content: center; 
    gap: 10px;
    margin-bottom: 16px;
  }

  .vacation-list-filter-input, .vacation-list-filter-select {
    border: 1px solid #d1d5db;
    padding: 8px;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .vacation-list-filter-input:focus, .vacation-list-filter-select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
  }

  .vacation-list-filter-reset-btn {
    background-color: #6b7280; 
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
  }

  .vacation-list-filter-reset-btn:hover {
    background-color: #4b5563; 
  }

  .vacation-list-table {
    width: 95%;
    border-collapse: collapse;
    justify-self: center;
    margin-top: 20px;
  }

  .vacation-list-table th,
  .vacation-list-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .vacation-list-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

   /* 상태별 텍스트 색상 */

  .status-approved {
    background-color: #d4edda; /* 초록 */
  }

  .status-pending {
    background-color: #fff3cd; /* 노랑 */
  }

  .status-rejected {
    background-color: #f8d7da; /* 빨강 */
  }

  .vacation-list-detail-btn {
    background-color: #2699e6;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .vacation-list-detail-btn:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    .vacation-list-table th,
    .vacation-list-table td {
      font-size: 12px; 
    }
  }

</style>

