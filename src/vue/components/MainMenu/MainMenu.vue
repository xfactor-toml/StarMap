<template>
  <div class="MainMenu__container">
    <div class="MainMenu">
      <div class="MainMenu__title --bold">STAR DEFENDER</div>
      <div class="MainMenu__close" @click="$emit('close')"></div>
      <img src="/gui/images/main-menu/main-menu-background.png">
      <div class="MainMenu__items">
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
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'MainMenu',
  data() {
    return {
      items: [
        { text: 'SEARCH GAME', opacity: 1, selected: false },
        { text: 'DUEL', opacity: 1, selected: true },
        { text: 'PLAY WITH A BOT', opacity: 1, selected: false },
        { text: 'LEADERS BOARD', opacity: 1, selected: false },
        { text: 'SETTINGS', opacity: 1, selected: false },
      ],
      scrolling: false,
    };
  },
  mounted() {
    const itemsContainer = this.$el.querySelector('.MainMenu__items') as HTMLElement;
    itemsContainer.addEventListener('scroll', this.handleScroll);

    this.debounceScrollStop = this.debounce(() => {
      this.stopScroll();
    }, 100); 
  },
  methods: {
    selectItem(name: string) {
      this.items.forEach(item => {
        item.selected = item.text === name;
      });
      this.$emit('selectItem', name); 
    },
    handleScroll(event: Event) {
      const container = event.target as HTMLElement;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const children = container.querySelectorAll('.MainMenu__item');

      children.forEach((item: HTMLElement, index: number) => {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.clientHeight;

        if (itemBottom >= scrollTop && itemTop <= scrollTop + clientHeight) {
          this.items[index].opacity = 1;
        } else if (
          (itemTop < scrollTop && itemBottom > scrollTop) || 
          (itemBottom > scrollTop + clientHeight && itemTop < scrollTop + clientHeight) 
        ) {
          this.items[index].opacity = 0.5;
        } else {
          this.items[index].opacity = 0.3;
        }
      });

      this.scrolling = true;
      this.debounceScrollStop();
    },
    stopScroll() {
      const itemsContainer = this.$el.querySelector('.MainMenu__items') as HTMLElement;
      const scrollTop = itemsContainer.scrollTop;
      const clientHeight = itemsContainer.clientHeight;
      const children = itemsContainer.querySelectorAll('.MainMenu__item');

      children.forEach((item: HTMLElement, index: number) => {
        const itemTop = item.offsetTop;
        const itemBottom = itemTop + item.clientHeight;

        if (itemBottom >= scrollTop && itemTop <= scrollTop + clientHeight) {
          this.items[index].opacity = 1;
        }
      });

      this.scrolling = false;
    },
    debounce(func: Function, wait: number) {
      let timeout: any;
      return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
  },
  props: {
    selectedItem: {
      type: String,
    }
  }
};
</script>



<style scoped src="./MainMenu.css"></style>
