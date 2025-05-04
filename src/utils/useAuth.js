import { ref, watchEffect } from 'vue';
import axios from 'axios';

export default function useAuth() {
  const isLoggedIn = ref(false);
  const isTokenRefreshing = ref(false);

  // 로그인 상태 확인 및 access token 유효성 검사
  const checkLoginStatus = async () => {
    try {
      // 로그인 상태 확인 API 호출 (토큰을 자동으로 쿠키에서 전송)
      await axios.get('http://localhost:8088/api/user/me', {
        withCredentials: true, // 쿠키를 자동으로 전송
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
          console.error('리프레시 토큰 만료 또는 오류:', refreshError);
          logout();
        } finally {
          isTokenRefreshing.value = false;
        }
      } else {
        console.error('토큰 유효성 검사 실패:', error);
        isLoggedIn.value = false;
      }
    }
  };
  
  // 로그아웃 함수
  const logout = () => {
    isLoggedIn.value = false;
  };

  // 컴포넌트가 로드될 때 실행
  watchEffect(() => {
    checkLoginStatus();
  });

  return {
    isLoggedIn,
    checkLoginStatus,
    logout,
  };
}


