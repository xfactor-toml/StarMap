<template>
  <div class="BoxContentPopup">
    <div class="BoxContentPopup__box">
      <div class="BoxContentPopup__body">
        <div class="BoxContentPopup__content">
          <img src="/gui/images/user-inventory/inventory/background.svg">
          <div class="BoxContentPopup__title">Congratulations</div>
          <div class="BoxContentPopup__close" @click="$emit('close')"></div>
          <div class="BoxContentPopup__cards">
            <template v-for="(item, index) in list" :key="item.name + index">
              <div class="BoxContentPopup__card" :data-rare="item.rare">
                <img :src="`/gui/images/user-inventory/inventory/${item.rare}.svg`" />
                <div class="BoxContentPopup__cardName">{{ item.name }} </div>
                <div class="BoxContentPopup__cardFigure">
                  <img class="BoxContentPopup__cardImage" :src="item.image" />
                </div>
                <div class="BoxContentPopup__cardCaption">
                  {{ item.value }} VRP
                </div>
              </div>
            </template>
          </div>
          <div class="BoxContentPopup__bottom">
            <div class="BoxContentPopup__animation">
                    <div class="BoxContentPopup__button" @click="$emit('sendLink')">
                        <img src="/gui/images/duel-box.svg">
                        <div class="BoxContentPopup__button-text">
                            OK
                        </div>
                    </div>
                    <!-- <div class="BoxContentPopup__button-animation" v-for="(item, index) in 30" :key="index">
                        <img src="/gui/images/user-inventory/open-box-border.svg" alt="logo">
                    </div> -->
                </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { BasePopup } from '@/components'
import { BattleReward } from '@/types';
import { PropType } from 'vue';

export default {
  name: 'BoxContentPopup',
  components: {
    BasePopup
  },
  props: {
    list: Array as PropType<BattleReward[]>,
  }
};
</script>

<style scoped src="./BoxContentPopup.css"></style>
