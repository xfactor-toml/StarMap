<template>
    <BaseItem
      :name="'quantumBooster'"
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown"
      :progress="progress"
    />
  </template>
  
  <script lang="ts">
  import { BaseItem } from './BaseItem';
  
  export default {
    name: 'QuantumBoosterItem',
    components: {
        BaseItem,
    },
    props: {
      active: {
        type: Boolean,
      },
      cooldown: {
        type: Number,
      },
      progress: {
        type: Number,
      },
      disabled: {
        type: Boolean,
      }
    }
  };
  </script>