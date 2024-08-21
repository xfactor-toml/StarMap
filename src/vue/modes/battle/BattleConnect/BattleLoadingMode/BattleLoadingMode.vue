<template>
   <transition name="fade">
     <BattleLoadingProgress />      
   </transition>
</template>

<script lang="ts">

import { BattleLoadingProgress } from '@/components';


export default {
  name: 'BattleLoadingMode',

  components: {
    BattleLoadingProgress
  },
};
</script>
