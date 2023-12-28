<template>
  <BaseControl :disabled="true"/>
</template>

<script lang="ts">
import { BaseControl } from './BaseControl';

export default {
  name: 'EmptyControl',
  components: {
    BaseControl,
  },
};
</script>
