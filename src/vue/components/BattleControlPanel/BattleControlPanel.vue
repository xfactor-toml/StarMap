<template>
  <div class="BattleControlPanel">
    <div class="BattleControlPanel__row">
      <EmptyControl/>
      <EmptyControl/>
    </div>
    <div class="BattleControlPanel__row">
      <LevelControl
        :disabled="true"
        :level="level"
        :progress="0"
      />
      <GoldControl
        :disabled="true"
        :amount="gold"
      />
      <ShopControl
        :disabled="true"
      />
    </div>
    <div class="BattleControlPanel__row">
      <SatelliteFireSkill
        :params="satelliteFireSkill"
        @fire="$emit('action', {
          type: 'satelliteFire'
        })"
      />
      <RocketFireSkill
        :disabled="true"
        :cooldown="0"
        :progress="0"
      />
      <SlowdownSkill
        :disabled="true"
        :cooldown="0"
        :progress="0"
      />
      <InvisibilitySkill
        :disabled="true"
        :cooldown="0"
        :progress="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { BattleActionType, BattleStoreState} from '@/types';

import {
  EmptyControl,
  GoldControl,
  LevelControl,
  ShopControl,
} from './controls';

import {
  InvisibilitySkill,
  SatelliteFireSkill,
  RocketFireSkill,
  SlowdownSkill
} from './skills';

export default {
  name: 'BattleControlPanel',
  components: {
    EmptyControl,
    GoldControl,
    InvisibilitySkill,
    LevelControl,
    RocketFireSkill,
    SatelliteFireSkill,
    ShopControl,
    SlowdownSkill
  },
  props: {
    skills: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      required: true,
    },
    gold: {
      type: Number,
      required: true,
    },
  },
  emits: {
    action: (payload: { type: BattleActionType }) => payload
  },
  computed: {
    satelliteFireSkill(): BattleStoreState['skills']['satelliteFire'] {
      return this.skills['satelliteFire']
    }
  }
};
</script>

<style scoped src="./BattleControlPanel.css"/>
