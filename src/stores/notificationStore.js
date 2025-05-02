import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    lastStatuses: {}, // vacationId -> 마지막 상태 저장
  }),
  actions: {
    getUpdatedVacations(vacationList) {
      const changedVacations = [];
      vacationList.forEach(v => {
        const prev = this.lastStatuses[v.id];
        if (prev && prev !== v.status) {
          changedVacations.push(v); // 바뀐 경우에만 모아둠둠
        }
        this.lastStatuses[v.id] = v.status;
      });
      return changedVacations;
    },
  },
});
