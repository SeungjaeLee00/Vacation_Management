import { createRouter, createWebHistory } from "vue-router";
import CalendarMain from "../views/CalendarMain.vue";
import MyPage from "../views/user/profile/MyPage.vue";
import VacationList from "../views/vacation/VacationList.vue";
// import SignupPage from "../views/user/account/SignupPage.vue";
import LoginPage from "../views/user/account/LoginPage.vue";
import VacationForm from "../views/vacation/VacationForm.vue";
import ForgotPassword from "@/views/user/account/ForgotPassword.vue";
import ResetPassword from "@/views/user/profile/ResetPassword.vue";
import ChangeName from "@/views/user/profile/ChangeName.vue";
import CheckUser from "@/views/user/profile/CheckUser.vue";
import axios from "axios";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/login", component: LoginPage },
  // { path: "/signup", component: SignupPage },
  { path: "/home", component: CalendarMain },
  { path: "/mypage", component: MyPage },

  { path: "/vacations", component: VacationList },
  { path: "/vacation-form", component: VacationForm },
  { path: "/find-password", component: ForgotPassword },

  { path: "/check-user", component: CheckUser }, 
  { path: "/change-password", component: ResetPassword },
  { path: "/change-name", component: ChangeName },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // 로그인 관련 페이지로 이동하는 경우는 바로 허용
  if (to.path === '/login' || to.path === '/find-password') {
    return next();  
  }

  // 토큰을 확인하기 위해 백엔드에 요청을 보내 인증 여부를 체크
  try {
    await axios.get("http://localhost:8088/api/user/me", {
      withCredentials: true,
    });

    // console.log("response", response)
    next();  
  } catch (error) {
    alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    next('/login');
  }
});

export default router;

