import { reactive } from 'vue';

export const timerStore = reactive({
  time: 30,
  timerId: null as number | null,

  startTimer() {
    if (!this.timerId && this.time > 0) { // Only start if timer is not running and time is > 0
      this.timerId = window.setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } 
        if (this.time === 0) {
          this.stopTimer(); // Auto-stop when time reaches 0
        }
      }, 1000); 
    }
  },

  stopTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  resetTimer() {
    this.stopTimer(); // Ensure any running timer is stopped first
    this.time = 30;   // Reset time to 30 seconds
  },
});

