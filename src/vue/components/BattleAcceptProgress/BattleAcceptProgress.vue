<template>
    <transition name="fade"> 
        <div class="container">
        <div class="BattleAcceptProgress">
            <div 
            class="BattleAcceptProgress__bar" 
            :style="{ width: progressWidth + '%' }"
            >
              <div class="BattleAcceptProgress__bar-tab">
              </div>
            </div>
        </div>
    </div>
    </transition>
   
    
</template>

<script lang="ts">
    export default {
        name: 'BattleAcceptProgress',
        data() {
            return {
                timeRemaining: this.totalTime,
                interval: 1000
            }
        },
        computed: {
            progressWidth() {
                if(this.increase) {
                    if (this.timeRemaining / this.maxTime >=1)
                        return 100;
                    else 
                       return  (this.timeRemaining / this.maxTime) * 100;
                }
                return (this.timeRemaining / this.totalTime) * 100;
            }
        },
        props: {
            totalTime: {
                type: Number
            },
            increase: {
                type: Boolean,
                default: false
            },
            maxTime: {
                type: Number
            }
        },
        methods: {
            startTimer() {
                this.timer = setInterval(() => {
                    if(this.increase) {
                        this.timeRemaining += this.interval / 1000;
                        this.$emit('update', this.timeRemaining);
                    }
                    else {
                        if (this.timeRemaining > 0) {
                        this.timeRemaining -= this.interval / 1000;
                        this.$emit('update', this.timeRemaining);
                        } 
                        else {
                            clearInterval(this.timer);
                        }

                    }

                }, 1000);
            },
        },
        mounted() {
            this.startTimer();
        },
        unmounted() {
            clearInterval(this.timer);
        }
          
    }
</script>

<style scoped src="./BattleAcceptProgress.css">

</style>