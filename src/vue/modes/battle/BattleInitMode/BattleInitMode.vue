<template>
  <div class="BattleInitMode">
    <template v-if="battleStore.members">
      <div class="BattleInitMode__top">
        <BattleInitMember
          :name="member.top.name"
          :address="member.top.address"
          :race="member.top.race"
        />
      </div>
      <div class="BattleInitMode__vs">VS</div>
      <div class="BattleInitMode__bottom">
        <BattleInitMember
          :name="member.bottom.name"
          :address="member.bottom.address"
          :race="member.bottom.race"
          :reflected="true"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { useBattleStore, useScenesStore } from '@/stores';
import { BattleInitMember } from '@/components';
import { mapStores } from 'pinia';

export default {
  name: 'BattleInitMode',
  components: {
    BattleInitMember,
  },
  data: () => ({
    activated: false
  }),
  computed: {
    ...mapStores(useBattleStore, useScenesStore),
    member() {
      const [member1, member2] = this.battleStore.members

      return {
        top: member1,
        bottom: member2
      }
    },
  },
};
</script>

<style scoped src="./BattleInitMode.css"></style>
