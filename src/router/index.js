import { createRouter, createWebHistory } from "vue-router";
import CalendarMain from "../views/CalendarMain.vue";
import MyPage from "../views/user/profile/MyPage.vue";
import VacationList from "../views/vacation/VacationList.vue";
import LoginPage from "../views/user/account/LoginPage.vue";
import VacationForm from "../views/vacation/VacationForm.vue";
import ForgotPassword from "@/views/user/account/ForgotPassword.vue";
import ResetPassword from "@/views/user/profile/ResetPassword.vue";
import ChangeName from "@/views/user/profile/ChangeName.vue";
import CheckUser from "@/views/user/profile/CheckUser.vue";
import ChangeProfileImg from "@/views/user/profile/ChangeProfileImg.vue";
import { useAuthStore } from "@/stores/auth";
import GuestBoot from "@/views/guestbook/GuestbootMain.vue";
// import NotificationPage from "@/views/NotificationPage.vue"

const routes = [
  { path: "/", component: LoginPage },
  { path: "/login", component: LoginPage },
  { path: "/home", component: CalendarMain },
  { path: "/mypage", component: MyPage },
  { path: "/department-guestbook", component:GuestBoot},
  { path: "/vacations", component: VacationList },
  { path: "/vacation-form", component: VacationForm },
  { path: "/find-password", component: ForgotPassword },
  { path: "/check-user", component: CheckUser },
  { path: "/change-password", component: ResetPassword },
  { path: "/change-name", component: ChangeName },
  { path: "/change-profile-img", component: ChangeProfileImg },
  // { path: "/notifications", component: NotificationPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/login" || to.path === "/find-password") {
    return next();
  }

  const auth = useAuthStore();

  try {
    await auth.checkLoginStatus(); // access token 만료 시 자동 갱신 포함
    if (auth.isLoggedIn) {
      return next();
    } else {
      throw new Error("로그인되지 않음");
    }
  } catch (err) {
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    return next("/login");
  }
});

export default router;
