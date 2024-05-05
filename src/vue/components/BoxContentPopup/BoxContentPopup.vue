<template>
  <BasePopup
    class="BoxContentPopup"
    @close="$emit('close')"
  >
    <div class="BoxContentPopup__content">
      <div class="BoxContentPopup__title">Congratulations</div>
      <div class="BoxContentPopup__cards">
        <template
          v-for="(item, index) in list"
          :key="item.name + index"
        >
          <div class="BoxContentPopup__card">
            <div class="BoxContentPopup__cardFigure">
              <img
                class="BoxContentPopup__cardImage"
                :src="item.image"
              />
            </div>
            <div class="BoxContentPopup__cardCaption">
              {{ item.name }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </BasePopup>
</template>

<script lang="ts">
import { BasePopup } from '@/components'
import { PropType } from 'vue';

export default {
  name: 'BoxContentPopup',
  components: {
    BasePopup
  },
  props: {
    list: Array as PropType<Array<{
      name: string,
      image: string
    }>>,
  }
};
</script>

<style scoped src="./BoxContentPopup.css"></style>
