<template>
  <transition name="fade">
    <BattleTutorialProgress />
  </transition>
</template>

<script lang="ts">
import { BattleTutorialProgress } from '@/components/BattleTutorialProgress';

export default {
  name: 'BattleAcceptMode',
  components: {
    BattleTutorialProgress
  }
}

</script>