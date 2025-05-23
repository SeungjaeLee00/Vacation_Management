<template>알림</template>

<!-- <template>
  <div class="notifications-sidebar">
    <div class="sidebar-header">
      <h2>알림</h2>
      <button @click="$emit('closeSidebar')">닫기</button>
    </div>
    <ul v-if="notifications.length > 0">
      <li v-for="(notification, index) in notifications" :key="index">
        <p>{{ notification.message }}</p>
        <small>{{ notification.time }}</small>
      </li>
    </ul>
    <p v-else>새로운 알림이 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { connect } from '@/utils/WebSocket'; // WebSocket 연결 함수

const userId = sessionStorage.getItem('userId');
const notifications = ref([]);

// WebSocket 연결 후 실시간 알림 받기
onMounted(() => {
  // 서버에서 알림 데이터 불러오기
  axios.get(`http://localhost:8088/api/notifications/user/${userId}`, {
    withCredentials: true
  })
    .then(response => {
      if(response.data.length === 0){
        return
      } else {
        // 알림 데이터를 가져오고, 기존 알림 배열에 추가
        notifications.value = response.data.map(notification => ({
          message: notification.message,
          time: new Date(notification.createdAt).toLocaleTimeString(), // 서버에서 받은 시간
        }));
      }
    })
    .catch(error => {
      console.error("알림을 불러오는 데 실패했습니다:", error);
    });

  // WebSocket 연결 및 실시간 알림 받기
  connect(userId, (message) => {
    const notification = {
      message: message,
      time: new Date().toLocaleTimeString(),  // 알림 수신 시간
    };
    notifications.value.push(notification);
  });
});
</script>

<style scoped>
.notifications-sidebar {
  background-color: white;
  padding: 20px;
  width: 300px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  background-color: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
}
</style> -->
