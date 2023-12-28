<template>
  <div class="BattleProcessMode">
    <div class="BattleProcessMode__content">
      <div
        v-for="player in [battleStore.players.connected, battleStore.players.current]"
        :key="player.address"
        class="BattleProcessMode__section"
      >
        <div class="BattleProcessMode__column">
          <div class="BattleProcessMode__caption">
            Player<br>{{ getShortAddress(player.address) }}
          </div>
        </div>
        <div class="BattleProcessMode__column">
          <div class="BattleProcessMode__caption">
            Start<br>{{ player.star }}
          </div>
        </div>
      </div>
    </div>
    <BattleControlPanel
      :skills="battleStore.state.skills"
      :level="battleStore.state.level"
      :gold="battleStore.state.gold"
      @action="$client.onBattleAction"
    />
  </div>
</template>

<script lang="ts">
import { useBattleStore } from '@/stores';
import { BattleControlPanel } from '@/components';
import { getShortAddress } from '@/utils';
import { mapStores } from 'pinia'; 

export default {
  name: 'BattleProcessMode',
  components: {
    BattleControlPanel,
  },
  computed: mapStores(useBattleStore),
  methods: {
    getShortAddress
  }
};
</script>

<style scoped src="./BattleProcessMode.css"/>
