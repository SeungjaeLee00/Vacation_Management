<template>
  <header class="main-header">
    <div class="logo-container">
      <img
        :src="headerLogo"
        :class="logoClass"
        alt="로고"
        @click="goToMainPage"
      />
      <h1 class="title" @click="goToMainPage">휴가 계획표</h1>
    </div>
    <nav ref="menuRef" :class="{ 'nav-open': isNavOpen }">
      <ul>
        <li><button @click="goToVacationForm">휴가 신청</button></li>
        <li><button @click="goToMyPage">마이페이지</button></li>
        <li>
          <button @click="handleAuth">
            {{ isLoggedIn ? "로그아웃" : "로그인" }}
          </button>
        </li>
      </ul>
      <button class="menu-toggle" @click="toggleNav">
        <!-- 햄버거 헤더 -->
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const logoLong = require("@/assets/ta9_logo_long.png");
const logoShort = require("@/assets/ta9_logo.png");

const router = useRouter();
const auth = useAuthStore();
const isLoggedIn = computed(() => auth.isLoggedIn);

const isNavOpen = ref(false); // 메뉴 토글 상태
const menuRef = ref(null); // 메늎 dom 참조용

const headerLogo = ref(logoLong);
const logoClass = ref("header-logo-long");

const handleAuth = () => {
  if (isLoggedIn.value) {
    auth.logout();
    router.push("/login");
  } else {
    router.push("/login");
  }
};

const goToVacationForm = () => {
  router.push("/vacation-form");
};

const goToMainPage = () => {
  router.push("/home");
};

const goToMyPage = () => {
  router.push("/mypage");
};

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isNavOpen.value = false;
  }
};

// 화면 크기 감지하여 로고 변경
const updateLogo = () => {
  if (window.innerWidth <= 768) {
    headerLogo.value = logoShort;
    logoClass.value = "header-logo-short";
  } else {
    headerLogo.value = logoLong;
    logoClass.value = "header-logo-long";
  }
};

onMounted(() => {
  updateLogo();
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", updateLogo);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 2px solid #ddd;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-logo-long {
  width: 150px;
  height: auto;
  cursor: pointer;
}

.header-logo-short {
  width: 60px;
  height: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  flex-grow: 1; /* 공간 차지하도록 설정 */
}

nav {
  display: flex;
  align-items: center;
}

nav ul {
  display: flex;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;
  transition: transform 0.3s ease;
}

nav button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  font-weight: bold;
}

nav button:hover {
  color: #2699e6;
}

/* 햄버거 메뉴 */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle .bar {
  width: 30px;
  height: 4px;
  background-color: #333;
  transition: all 0.3s;
}

/* 작은 화면에서 메뉴 토글 */
@media (max-width: 768px) {
  nav ul {
    display: none;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    top: 60px;
    right: 20px;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 8px;
    z-index: 100;
  }

  nav.nav-open ul {
    display: flex;
    transform: translateY(0);
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
