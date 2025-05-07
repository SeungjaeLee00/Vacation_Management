import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const isTokenRefreshing = ref(false);

  // 로그인 상태 확인 및 access token 유효성 검사
  const checkLoginStatus = async () => {
    try {
      // 로그인 상태 확인 API 호출 (토큰을 자동으로 쿠키에서 전송)
      await axios.get('http://localhost:8088/api/user/me', {
        withCredentials: true, 
      });
  
      isLoggedIn.value = true;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        !isTokenRefreshing.value
      ) {
        // access token이 만료된 경우 refresh 진행
        isTokenRefreshing.value = true;
  
        try {
          await axios.post(
            'http://localhost:8088/api/user/refresh-token',
            {}, 
            { withCredentials: true }
          );
  
          // 새로운 access token을 response로 받지만, 클라이언트에서는 이를 처리하지 않음
          // 서버에서 이미 쿠키에 설정한 상태로 전달
  
          isLoggedIn.value = true;
  
          // 다시 상태 확인
          await checkLoginStatus();
        } catch (refreshError) {
          // console.error('리프레시 토큰 만료 또는 오류:', refreshError);
          logout();
        } finally {
          isTokenRefreshing.value = false;
        }
      } else {
        // console.error('토큰 유효성 검사 실패:', error);
        isLoggedIn.value = false;
      }
    }
  };
  
  // 로그아웃 함수
  const logout = async () => {
    try{
      await axios.post(
        'http://localhost:8088/api/user/logout',
        {}, 
        { withCredentials: true }
      );
      console.log("로그아웃 성공");
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


