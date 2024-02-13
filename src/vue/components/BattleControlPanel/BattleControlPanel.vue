<template>
  <div class="BattleControlPanel">
    <!-- <div class="BattleControlPanel__row">
      <EmptyControl/>
      <EmptyControl/>
    </div> -->
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
        :cooldown="cooldown['satelliteFire']"
        :disabled="isPendingSkill('satelliteFire')"
        @fire="
          $emit('action', {
            type: 'satelliteFire'
          })
        "
      />
      <RocketFireSkill
        :disabled="true"
        :cooldown="null"
        :progress="0"
      />
      <SlowdownSkill
        :disabled="true"
        :cooldown="null"
        :progress="0"
      />
      <InvisibilitySkill
        :disabled="true"
        :cooldown="null"
        :progress="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { BattleActionType, BattleCooldown, BattleData } from '@/types';
import { PropType } from 'vue';

import {
  EmptyControl,
  GoldControl,
  LevelControl,
  ShopControl
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
      type: Object as PropType<BattleData['skills']>,
      required: true
    },
    skillsPendingList: {
      type: Array as PropType<BattleActionType[]>,
      required: true
    },
    cooldown: {
      type: Object as PropType<BattleCooldown>,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    gold: {
      type: Number,
      required: true
    }
  },
  emits: {
    action: (payload: { type: BattleActionType }) => payload
  },
  computed: {
    satelliteFireSkill(): BattleData['skills']['satelliteFire'] {
      return this.skills['satelliteFire'];
    }
  },
  methods: {
    isPendingSkill(type: BattleActionType) {
      return this.skillsPendingList.includes(type);
    }
  }
};
</script>

<style scoped src="./BattleControlPanel.css" />
