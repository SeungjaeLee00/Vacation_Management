<template>
    <footer class="main-footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>전화: 02.556.9635 | 팩스: 02.6499.9637</p>
          <p>주소: 06149 서울특별시 강남구 선릉로 523 유림빌딩 4층</p>
          <p>&copy; 2025 Seungjae.</p>
        </div>
        <img :src="footerLogo" :class="logoClass" alt="회사 로고" />
      </div>
    </footer>
</template>
  
<script setup>
  import { ref, watchEffect } from "vue";
 
  // 화면 크기에 따라 로고 이미지 설정
  const logoLong = require("@/assets/ta9_logo_long.png");
  const logoShort = require("@/assets/ta9_logo.png");

  const footerLogo = ref(logoLong);
  const logoClass = ref("footer-logo-long");
  
  // 화면 크기 감지하여 로고 변경
  const updateLogo = () => {
    if (window.innerWidth <= 768) {
      footerLogo.value = logoShort;
      logoClass.value = "footer-logo-short"; 
    } else {
      footerLogo.value = logoLong;
      logoClass.value = "footer-logo-long"; 
    }
  };

  // 페이지 로드 시 및 창 크기 변경 시 로고 업데이트
  watchEffect(() => {
    updateLogo();
    window.addEventListener("resize", updateLogo);
  });
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
  
  .footer-logo-long {
    width: 150px;
    height: auto;
  }

  .footer-logo-short {
    width: 60px;  
    height: auto;
  }


</style>
  