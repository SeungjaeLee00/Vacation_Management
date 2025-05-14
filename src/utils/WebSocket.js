import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

function connect(userId, onMessageReceived) {
  const socket = new SockJS('http://localhost:8088/notifications', null, {
    withCredentials: true
  }); 

  stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: (frame) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe(`/topic/notifications/${userId}`, (notification) => {
        console.log('수신된 알림:', notification.body);  // 로그 찍기
        
        // alert 띄우기
        showNotification(notification.body);

        // 콜백 함수 실행하여 컴포넌트에서 알림 추가
        if (onMessageReceived) {
          onMessageReceived(notification.body);
        }
      });
    },
    onStompError: (error) => {
      console.error('STOMP error', error);
    }
  });

  stompClient.activate();
}

function showNotification(message) {
  alert("새 알림: " + message);
}

function disconnect() {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
  console.log("Disconnected");
}

export { connect, disconnect };
