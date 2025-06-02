<template>
  <div class="vacation-container">
    <div class="vacation-list">
      <h2 class="vacation-list-title">휴가 신청 내역</h2>

      <!-- 필터 영역 -->
      <div class="vacation-list-filter-container">
        <select v-model="selectedStatus" class="vacation-list-filter-select">
          <option value="">전체 상태</option>
          <option value="APPROVED">승인됨</option>
          <option value="PENDING">대기 중</option>
          <option value="REJECTED">거절됨</option>
          <option value="CANCELLED">취소됨</option>
        </select>

        <select v-model="sortOrder" class="vacation-list-filter-select">
          <option value="newest">최신순</option>
          <option value="oldest">오래된 순</option>
        </select>
        <button @click="resetFilters" class="vacation-list-filter-reset-btn">
          초기화
        </button>
      </div>

      <div v-if="filteredLeaves.length === 0">
        <p>신청한 휴가가 없습니다. 첫 휴가를 써보세요 :)</p>
      </div>

      <!-- 휴가 신청 목록 (페이지네이션 적용) -->
      <table v-else class="vacation-list-table">
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
            <td>
              <ul>
                <li
                  class="vf-vacationType"
                  v-for="used in leave.usedVacations"
                  :key="used.vacationTypeName"
                >
                  {{ used.vacationTypeName }} {{ used.usedDays }}일
                </li>
              </ul>
            </td>

            <td>{{ leave.startAt }}</td>
            <td>{{ leave.endAt }}</td>
            <td :class="statusClass(leave.status)">
              {{ statusTranslation(leave.status) }}
            </td>
            <td class="vacation-list-text-center">
              <button
                @click="viewDetails(leave)"
                class="vacation-list-detail-btn"
              >
                보기
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <!-- 페이지 변경 시, currentPage 값 갱신 -->
      <VuePagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="currentPage = $event"
      />
    </div>

    <!-- 휴가 내용 상세 모달 -->
    <VacationDetailModal
      v-if="selectedLeave"
      :leave="selectedLeave"
      @close="selectedLeave = null"
      @vacation-cancelled="handleVacationCancelled"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import VuePagination from "@/components/VuePagination.vue";
import VacationDetailModal from "@/components/modals/VacationDetailModal.vue";

const selectedStatus = ref("");
const sortOrder = ref("newest");
const selectedLeave = ref(null);
const currentPage = ref(1);
const itemsPerPage = 5;

// 휴가 신청 리스트
const leaves = ref([]);

// 휴가 신청 목록 조회 API
const fetchVacationRequests = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8088/api/vacations/my-vacations",
      {
        withCredentials: true,
      }
    );
    leaves.value = response.data;
  } catch (error) {
    alert("휴가 신청 내역을 가져오는 데 실패했습니다.");
  }
};

// 컴포넌트가 마운트 될 때 데이터 로드
onMounted(() => {
  fetchVacationRequests();
});

// 필터링된 휴가 신청 내역 반환
const filteredLeaves = computed(() => {
  let filteredData = leaves.value.filter((leave) => {
    const matchesStatus =
      (selectedStatus.value === "" || leave.status === selectedStatus.value) &&
      leave.status !== "DELETED";

    return matchesStatus;
  });

  // 날짜별 정렬 (최신순/오래된 순)
  filteredData = filteredData.sort((a, b) => {
    const dateA = new Date(a.requestDate);
    const dateB = new Date(b.requestDate);

    if (sortOrder.value === "newest") {
      return dateB - dateA; // 최신순
    } else {
      return dateA - dateB; // 오래된 순
    }
  });

  return filteredData;
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredLeaves.value.length / itemsPerPage) || 1;
});

// 페이지네이션에 맞추어 보여줄 휴가 신청 내역
const paginatedLeaves = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage; // 시작 인덱스
  return filteredLeaves.value.slice(start, start + itemsPerPage); // 해당 페이지에 맞는 항목만 반환
});

// 휴가 신청 상세보기
const viewDetails = (leave) => {
  selectedLeave.value = leave; // 선택된 휴가 신청 내역을 상세 모달로 전달
  // console.log("모달로 넘겨주는 값", leave)
};

// 상태에 맞는 CSS 클래스 반환
const statusClass = (status) => {
  if (status === "APPROVED") return "status-approved";
  if (status === "PENDING") return "status-pending";
  if (status === "REJECTED") return "status-rejected";
  return "";
};

// 상태를 한국어로 변환
const statusTranslation = (status) => {
  if (status === "APPROVED") return "승인됨";
  if (status === "PENDING") return "대기 중";
  if (status === "REJECTED") return "거절됨";
  if (status === "CANCELLED") return "취소됨";
  return status; // 기본적으로 그대로 반환
};

// 필터 초기화
const resetFilters = () => {
  selectedStatus.value = "";
  sortOrder.value = "newest";
  currentPage.value = 1; // 필터 초기화할 때 페이지도 1로 돌ㅇ오옴
  fetchVacationRequests(); // 필터 초기화 후 다시 API 호출
};
</script>

<style scoped>
.vacation-list-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 50px;
  text-align: center;
}

.vacation-list-filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.vacation-list-filter-select {
  border: 1px solid #d1d5db;
  width: 200px;
  padding: 8px;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.vacation-list-filter-input:focus,
.vacation-list-filter-select:focus {
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

.vacation-list-filter-btn {
  background-color: #93bf85;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.vacation-list-filter-btn:hover {
  background-color: #6eaa5e;
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
