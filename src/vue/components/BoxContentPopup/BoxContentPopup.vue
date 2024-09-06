<template>
  <div class="BoxContentPopup">
    <div class="BoxContentPopup__box">
        <div class="BoxContentPopup__body">
          <div class="BoxContentPopup__content">
            <img src="/gui/images/user-inventory/inventory/background.png" alt="Background">
            <div class="BoxContentPopup__title --bold">Congratulations</div>
            <div class="BoxContentPopup__close" @click="$emit('close')"></div>
            <div class="BoxContentPopup__cards">
              <div v-for="(item, index) in list" :key="item.name + index" class="BoxContentPopup__card" :data-rare="item.rare">
                <img :src="`/gui/images/user-inventory/inventory/${item.rare}.svg`" :alt="item.rare">
                <div class="BoxContentPopup__cardName">{{ item.name }}</div>
                <div class="BoxContentPopup__cardFigure">
                  <img class="BoxContentPopup__cardImage" :src="item.image" :alt="item.name">
                </div>
                <div class="BoxContentPopup__cardCaption">{{ item.value }} VRP</div>
              </div>
            </div>
            <div class="BoxContentPopup__bottom">
              <div class="BoxContentPopup__animation">
                <div class="BoxContentPopup__button" @click="$emit('close')">
                  <img src="/gui/images/duel-box.svg" alt="Duel box">
                  <div class="BoxContentPopup__button-text">OK</div>
                </div>
                <div v-for="index in 20" :key="index" class="BoxContentPopup__button-animation">
                  <img src="/gui/images/user-inventory/open-box-border.svg" alt="Box border">
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BasePopup } from '@/components';
import { BattleReward } from '@/types';

export default defineComponent({
  name: 'BoxContentPopup',
  components: {
    BasePopup
  },
  props: {
    list: {
      type: Array as PropType<BattleReward[]>,
      required: true
    }
  }
});
</script>

<style scoped src="./BoxContentPopup.css"></style>