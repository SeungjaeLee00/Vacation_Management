<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <h3>{{ selectedDate }} 휴가자</h3>
        <ul v-if="selectedEvents.length > 0">
          <li v-for="(event, index) in selectedEvents" :key="index">
            {{ event.title }}
          </li>
        </ul>
        <p v-else>이 날은 휴가자가 없습니다.</p>
        <button @click="$emit('close')">닫기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedDate: String,
      selectedEvents: Array,
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    z-index: 11;
  }
  
  .modal h3 {
    margin-bottom: 10px;
  }
  
  .modal ul {
    list-style: none;
    padding: 0;
  }
  
  .modal li {
    background: #f4f4f4;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .modal button {
    margin-top: 10px;
    padding: 8px 12px;
    background: #2699e6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal button:hover {
    background: #0056b3;
  }
  </style>
  