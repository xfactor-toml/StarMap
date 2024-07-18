<template>
    <BaseItem
      :name="'surgesSpire'"
      :active="active"
      :disabled="disabled"
      :cooldown="cooldown"
      :progress="progress"
    />
  </template>
  
  <script lang="ts">
  import { BaseItem } from './BaseItem';
  
  export default {
    name: 'SurgesSpireItem',
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