import { createRouter, createWebHistory } from "vue-router";
import CalendarMain from "../views/CalendarMain.vue";
import MyPage from "../views/user/MyPage.vue";
import VacationList from "../views/vacation/VacationList.vue";
import SignupPage from "../views/user/SignupPage.vue";
import LoginPage from "../views/user/LoginPage.vue";
import VacationForm from "../views/vacation/VacationForm.vue";
import ForgotPassword from "@/views/user/ForgotPassword.vue";
import ResetPassword from "@/views/user/ResetPassword.vue";
import ChangeName from "@/views/user/ChangeName.vue";
import CheckUser from "@/views/user/CheckUser.vue";

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

export default router;
