<template>
  <div class="SearchingMenu__container">
    <div class="SearchingMenu">
      <div class="SearchingMenu__previous" @click="changeStatus">
        <img src="/gui/images/duel-previous.svg">
      </div>
      <div class="SearchingMenu__title --bold"> {{ setTitle }} </div>
      <div class="SearchingMenu__close" @click="close"></div>
      <div v-if="currentMenu === 'DUEL'" class="SearchingMenu__inviteFriend" @click="inviteFriend">
        <img src="/gui/images/invite-friend.svg">
      </div>
      <img src="/gui/images/main-menu/main-menu-background.png">
      <div class="SearchingMenu__items">
        <div class="SearchingMenu__link">
          <span class="SearchingMenu__label">{{ setLabel }}</span>
          <div class="SearchingMenu__loading">
            <div v-for="dot in dotsAmount" class="SearchingMenu__dot" :class="{
              'is-active': dot === activeDot,
              'is-disabled': interval === null,
            }" />
          </div>
          <span class="SearchingMenu__time">{{ formattedDuration }}</span>
        </div>

        <div class="SearchingMenu__animation">
          <div class="SearchingMenu__button" @click="cancelSearching">
            <img src="/gui/images/searching-menu-box.svg">
            <div class="SearchingMenu__button-text">
              Cancel
            </div>
          </div>
          <div class="SearchingMenu__button-animation" v-for="(item, index) in 12" :key="index">
            <img src="/gui/images/searching-menu-box-border.svg" alt="logo">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { formatDuration } from '@/utils';

export default {
  name: 'SearchingMenu',
  emits: ['click'],
  props: {
    updateInterval: {
      type: Number,
      default: 143 // second / dots amount
    },
    currentMenu: {
      type: String
    }
  },
  data: () => ({
    activeDot: 1,
    dotsAmount: 7,
    initialTime: Date.now(),
    interval: null,
    passedTime: 0,
  }),
  computed: {
    formattedDuration() {
      return formatDuration(this.passedTime)
    },
    setTitle() {
      if (this.currentMenu === 'SEARCH GAME')
        return 'SEARCHING'
      else
        return 'WAITING'
    },
    setLabel() {
      if (this.currentMenu == 'SEARCH GAME')
        return 'RANDOM GAME'
      else if (this.currentMenu == 'PLAY WITH A BOT')
        return 'BOT'
      else
        return 'DUEL'
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      const nextDot = this.activeDot + 1
      this.passedTime = Date.now() - this.initialTime
      this.activeDot = nextDot > this.dotsAmount ? 1 : nextDot
    }, this.updateInterval);
  },
  unmounted() {
    clearInterval(this.interval)
  },
  methods: {
    changeStatus() {
      this.$emit('previous', this.currentMenu)
    },
    close() {
      this.$emit('close')
    },
    cancelSearching() {
      this.$emit('cancel', this.currentMenu)
    },
    inviteFriend() {
      this.$emit('inviteFriend')
    }
  },
};

</script>

<style scoped src="./SearchingMenu.css"></style>