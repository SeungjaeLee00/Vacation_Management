import { createRouter, createWebHistory } from "vue-router";
import CalendarMain from "../views/CalendarMain.vue";
import MyPage from "../views/user/profile/MyPage.vue";
import VacationList from "../views/vacation/VacationList.vue";
import SignupPage from "../views/user/account/SignupPage.vue";
import LoginPage from "../views/user/account/LoginPage.vue";
import VacationForm from "../views/vacation/VacationForm.vue";
import ForgotPassword from "@/views/user/account/ForgotPassword.vue";
import ResetPassword from "@/views/user/profile/ResetPassword.vue";
import ChangeName from "@/views/user/profile/ChangeName.vue";
import CheckUser from "@/views/user/profile/CheckUser.vue";

const routes = [
  { path: "/", component: LoginPage },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
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

router.beforeEach((to, from, next) => {
  const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('Token'));

  // console.log(token);
  // if (token) {
  //   const tokenValue = token.split('Token')[1];
  //   console.log(tokenValue);
  // } else {
  //   console.log('Token이 없습니다');
  // }

  // 로그인 관련 조건 검사
  if (to.path === '/login' || to.path === '/signup' || to.path === '/find-password') {
    return next();  // 로그인, 회원가입, 비밀번호 찾기 페이지로 이동할 수 있게 허용
  }

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    return next('/login');
  }

  // 모든 조건 통과하면 이동동
  next();
});

export default router;

