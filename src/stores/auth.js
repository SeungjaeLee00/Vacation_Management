import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const isTokenRefreshing = ref(false);

  // 로그인 상태 확인 및 access token 유효성 검사
  const checkLoginStatus = async () => {
  try {
    console.log("checkLoginStatus: 시작됨");

    await axios.get('http://localhost:8088/api/user/me', {
      withCredentials: true, 
    });

    console.log("로그인 상태 확인 성공");
    isLoggedIn.value = true;
  } catch (error) {
    console.log("로그인 상태 확인 실패", error);
    // console.log("error.response", error?.response);

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !isTokenRefreshing.value
    ) {
      console.log("accessToken 만료 → refresh 시도");

      isTokenRefreshing.value = true;

      try {
        await axios.post(
          'http://localhost:8088/api/auth/refresh-token',
          {}, 
          { withCredentials: true }
        );

        console.log("accessToken 재발급 성공");

        isLoggedIn.value = true;
        await checkLoginStatus(); // 재귀 재시도
      } catch (refreshError) {
        console.log("refreshToken 실패", refreshError);
        logout();
      } finally {
        isTokenRefreshing.value = false;
      }
    } else {
      console.log("기타 에러 또는 이미 refresh 중: ", error);
      isLoggedIn.value = false;
    }
  }
};

  
  // 로그아웃 함수
  const logout = async () => {
    try{
      await axios.post(
        'http://localhost:8088/api/auth/logout',
        {}, 
        { withCredentials: true }
      );
      console.log("로그아웃 성공");
      sessionStorage.clear();
      // await checkLoginStatus();
    } catch (error) {
      console.log("로그아웃 실패, ", error);
    } finally {
      isLoggedIn.value = false;
    }
  };

  return {
    isLoggedIn,
    checkLoginStatus,
    logout,
  };
});


