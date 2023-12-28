<template>
  <div
    class="BattleInitMember"
    :class="{
      'is-reflected': reflected
    }"
  >
    <div class="BattleInitMember__header">
      <div class="BattleInitMember__wallet">{{ getShortAddress(address) }}</div>
      <div class="BattleInitMember__name">{{ name }}</div>
    </div>
    <div class="BattleInitMember__body">
      <span>Wallet</span>
      <span>{{ getShortAddress(address) }}</span>
    </div>
    <div class="BattleInitMember__footer">
      <div class="BattleInitMember__race">{{ race }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { getShortAddress } from '@/utils';

export default {
  name: 'BattleInitMember',
  props: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    race: {
      type: String,
      required: true
    },
    reflected: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    getShortAddress
  }
};
</script>

<style scoped src="./BattleInitMember.css"></style>
