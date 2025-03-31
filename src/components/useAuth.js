import { ref, watchEffect } from 'vue';

export default function useAuth() {
  const isLoggedIn = ref(false);

  const checkLoginStatus = () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('Token='));
    isLoggedIn.value = token ? true : false;
  };

  const logout = () => {
    document.cookie = "Token=; Max-Age=0; path=/";  
    isLoggedIn.value = false; 
  };

 watchEffect(() => {
  checkLoginStatus(); 
  });

  console.log(isLoggedIn.value)
  
  return {
    isLoggedIn,
    checkLoginStatus,
    logout
  };
}
