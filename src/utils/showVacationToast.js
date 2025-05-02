import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
// import { useRouter } from 'vue-router';
import router from "@/router"; // useRouter() 대신 직접 import



export function showVacationToast(vacation) {
  // const router = useRouter();
  if (!["Approved", "Rejected"].includes(vacation.status)) return;

  const statusMessage =
    vacation.status === "Approved"
      ? "승인되었습니다"
      : "반려되었습니다";

  const start = new Date(vacation.startAt).toISOString().slice(0, 10);
  const end = new Date(vacation.endAt).toISOString().slice(0, 10);

  toast(`휴가 신청이 ${statusMessage}: ${start} ~ ${end}`, {
    theme: "auto",
    type: vacation.status === "Approved" ? "success" : "error",
    position: "top-center",
    pauseOnHover: true,
    autoClose: 5000,
    hideProgressBar: true,
    // 토스트 클릭하면 마이페이지>나의 휴가 내역 페이지로 이동동
    onClick: () => {
      router.push("/vacations");
    },
  });
}
