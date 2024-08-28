<template>
  <div class="MainMenu__container">
    <div class="MainMenu">
      <div class="MainMenu__title">Main Menu</div>
      <div class="MainMenu__close" @click="$emit('close')"></div>
      <img src="/gui/images/main-menu/main-menu-background.png">
      <div class="MainMenu__items">
        <div 
          v-for="(item, index) in items" 
          :key="index" 
          :class="{ 'MainMenu__item--selected': item.text == selectedItem || (selectedItem == null && item.text == 'DUEL') }"
          class="MainMenu__item"
          @click="selectItem(item.text)"
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
        { text: 'SETTINGS', opacity: 1, selected: false },
      ],
    };
  },
  methods: {
    selectItem(name: string) {
      this.items.forEach(item => {
        item.selected = item.text === name;
      });
      this.$emit('selectItem', name); // Emit the selected item to the parent
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
