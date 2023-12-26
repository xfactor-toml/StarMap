<template>
  <div class="PrepareMode">
    <template v-if="battleStore.members">
      <div class="PrepareMode__top">
        {{ member.top.name }}
      </div>
      <div class="PrepareMode__bottom">
        {{ member.bottom.name }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { mapStores } from 'pinia'; 

export default {
  name: 'PrepareMode',
  computed: {
    ...mapStores(useBattleStore),
    member() {
      const [member1, member2] = this.battleStore.members

      return {
        top: member1,
        bottom: member2
      }
    }
  },
};
</script>

<style scoped src="./PrepareMode.css"></style>
