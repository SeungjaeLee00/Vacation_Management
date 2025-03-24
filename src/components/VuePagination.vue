<template>
  <div class="pagination-container">
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1"
      class="pagination-btn">
      이전
    </button>
    
    <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
    
    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === totalPages"
      class="pagination-btn">
      다음
    </button>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: Number,
    totalPages: Number,
  },
  methods: {
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.$emit('page-changed', newPage);
      }
    },
  },
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center; 
  align-items: center;
  margin-top: 16px;
  gap: 10px;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background-color: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.pagination-btn:hover {
  background-color: #e5e7eb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 16px;
  font-weight: bold;
}
</style>
