<template>
  <div class="MainMenu__container">
    <div class="MainMenu">
      <div class="MainMenu__title --bold">STAR DEFENDER</div>
      <div class="MainMenu__close" @click="$emit('close')"></div>
      <img src="/gui/images/main-menu/main-menu-background.png">
      <div class="MainMenu__items" ref="menuItems">
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          :class="[
            'MainMenu__item', 
            { 'MainMenu__item--selected': item.text == selectedItem },
            { 'MainMenu__item--disabled': item.text === 'SEARCH GAME' }
          ]"
          :style="{ opacity: item.opacity }"
          @click="item.text !== 'SEARCH GAME' && selectItem(item.text)"
        >
          {{ item.text }}
        </div>
      </div>
      <div 
        class="MainMenu__items-boxshadow"
        :class="{ 'MainMenu__items-boxshadow--hidden': isScrolledToBottom }"
      ></div> 
      
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MainMenu',
  props: {
    selectedItem: {
      type: String,
    }
  },
  data() {
    return {
      items: [
        { text: 'SEARCH GAME', opacity: 1, selected: false },
        { text: 'DUEL', opacity: 1, selected: true },
        { text: 'PLAY WITH A BOT', opacity: 1, selected: false },
        { text: 'LEADERS BOARD', opacity: 1, selected: false },
        { text: 'QUESTS', opacity: 1, selected: false },
        { text: 'SETTINGS', opacity: 1, selected: false },
      ],
      scrolling: false,
      isScrolledToBottom: false,
    };
  },
  mounted() {
    const menuItems = this.$refs.menuItems;
    let startY;

    menuItems.addEventListener('touchstart', (e) => {
      startY = e.touches[0].pageY;
    });

    menuItems.addEventListener('touchmove', (e) => {
      const moveY = e.touches[0].pageY - startY;
      menuItems.scrollTop -= moveY;
      startY = e.touches[0].pageY;
      e.preventDefault(); 
    });
  },
  methods: {
    selectItem(name: string) {
      this.items.forEach(item => {
        item.selected = item.text === name;
      });
      this.$emit('selectItem', name); 
    },
    handleScroll(event: Event) {
      // const target = event.target as HTMLElement;
      // const bottomReached = Math.abs(
      //   target.scrollHeight - target.scrollTop - target.clientHeight
      // ) < 5;
      // this.isScrolledToBottom = bottomReached;
    },
  },
 
};
</script>



<style scoped src="./MainMenu.css"></style>
