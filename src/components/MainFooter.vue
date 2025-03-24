<template>
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>전화: 02.556.9635 | 팩스: 02.6499.9637</p>
          <p>주소: 06149 서울특별시 강남구 선릉로 523 유림빌딩 4층</p>
          <p>&copy; 2025 Seungjae., Ltd All rights reserved.</p>
        </div>
        <img :src="logo" alt="회사 로고" class="footer-logo" />
      </div>
    </footer>
</template>
  
<script setup>
  import logo from "@/assets/ta9_logo_long.png"; 
</script>
  
<style scoped>
  .main-footer {
    width: 100%;
    padding: 15px 20px;
    text-align: left;
    /* position: fixed; */
    bottom: 0;
    left: 0;
    font-size: 14px;
    border-top: 2px solid #ddd;
    display: flex;
    justify-content: center;
    height: 80px;
    margin-top: auto;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    max-width: 1200px;
  }
  
  .footer-info p {
    margin: 2px 0;
    color: #555;
  }
  
  .footer-logo {
    width: 130px;
    height: auto;
  }

</style>
  