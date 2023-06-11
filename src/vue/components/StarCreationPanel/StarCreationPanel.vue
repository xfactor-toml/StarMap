<template>
  <div class="StarCreationPanel" ref="tooltip">
    <div class="StarCreationPanel__header">
      <img class="StarCreationPanel__preview" :src="star.preview" />
      <div class="StarCreationPanel__create">Create star</div>
      <button
        class="StarCreationPanel__close"
        type="button"
        title="close"
        @click="hide()"
        @mouseenter="hover()"
      />
    </div>
    <div class="StarCreationPanel__body">
      <input
        ref="input"
        v-model="starName"
        class="StarCreationPanel__name"
        placeholder="Come up with a name for the star"
      />
      <div class="StarCreationPanel__group">
        <div class="StarCreationPanel__label">Cost:</div>
        <div class="StarCreationPanel__wallet">
          <div class="StarCreationPanel__price">0,00346</div>
          <div class="StarCreationPanel__currency">plasma</div>
        </div>
      </div>
      <div class="StarCreationPanel__group">
        <div class="StarCreationPanel__label">Available in the wallet:</div>
        <div class="StarCreationPanel__wallet is-blocked">
          <div class="StarCreationPanel__price">130,0024</div>
          <div class="StarCreationPanel__currency">plasma</div>
        </div>
      </div>
      <div class="StarCreationPanel__group">
        <!-- <button class="StarCreationPanel__button" @click="create" @mouseenter="hover">
          Create
        </button> -->
        <button class="StarCreationPanel__button" @click="approve" @mouseenter="hover">
          Approve
        </button>
        <!-- <div class="StarCreationPanel__notice" v-html="notice" /> -->
      </div>
    </div>
    <div class="StarCreationPanel__footer" />
  </div>
</template>

<script lang="ts">
import { Star } from '@/models';
import { PropType } from 'vue';

export default {
  name: 'StarCreationPanel',
  props: {
    star: {
      type: Object as PropType<Star>
    }
  },
  data: () => ({
    starName: '',
    notice: 'No name has been created<br>for the star'
    // notice: 'Insufficient fundsto purchase',
  }),
  methods: {
    hide() {
      this.$emit('hide');
    },
    create() {
      this.$emit('create');
    },
    approve() {
      this.$emit('approve');
    },
    hover() {
      this.$emit('hover');
    }
  },
  mounted() {
    this.$refs.input.focus();
  }
};
</script>

<style scoped src="./StarCreationPanel.css"></style>
