<template>
  <div class="BattleControlPanel">
    <div class="BattleControlPanel__row">
      <EmptyControl
        :disabled="true"
      />
      <EmptyControl
        :disabled="true"
      />
    </div>
    <div class="BattleControlPanel__row">
      <LevelControl
        :disabled="true"
        :level="level.current"
        :progress="level.progress"
      />
      <GoldControl
        :disabled="true"
        :amount="gold"
      />
      <ShopControl
        :active="true"
        :disabled="false"
      />
    </div>
    <div class="BattleControlPanel__row">
      <SatelliteFireSkill
        :params="skills['satelliteFire']"
        :cooldown="cooldown['satelliteFire']"
        :disabled="isPendingSkill('satelliteFire')"
        :active="true"
        @fire="call('satelliteFire')"
        @levelUp="levelUp('satelliteFire')"
      />
      <RocketFireSkill
        :params="skills['rocketFire']"
        :cooldown="cooldown['rocketFire']"
        :disabled="isPendingSkill('rocketFire')"
        @fire="call('rocketFire')"
        @levelUp="levelUp('rocketFire')"
      />
      <SlowdownSkill
        :params="skills['slowdown']"
        :cooldown="cooldown['slowdown']"
        :disabled="isPendingSkill('slowdown')"
        @apply="call('slowdown')"
        @levelUp="levelUp('slowdown')"
      />
      <InvisibilitySkill
        :params="skills['invisibility']"
        :cooldown="cooldown['invisibility']"
        :disabled="isPendingSkill('invisibility')"
        @apply="call('invisibility')"
        @levelUp="levelUp('invisibility')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  BattleActionType,
  BattleCooldown,
  BattleData,
  BattleActionPayload
} from '@/types';
import { PropType } from 'vue';

import {
  EmptyControl
} from './controls';

import {
  GoldControl,
  LevelControl,
  ShopControl
} from './controls';

import {
  InvisibilitySkill,
  RocketFireSkill,
  SatelliteFireSkill,
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
      type: Object as PropType<BattleData['level']>,
      required: true
    },
    gold: {
      type: Number,
      required: true
    }
  },

  emits: {
    action: (payload: BattleActionPayload) => payload,   
},
  methods: {
    call(actionType: BattleActionType) {
      this.$emit('action', {
        action: actionType,
        type: 'call',
      })
    },
    levelUp(actionType: BattleActionType) {
      this.$emit('action', {
        action: actionType,
        type: 'levelUp',
      })
    },
    isPendingSkill(type: BattleActionType) {
      return this.skillsPendingList.includes(type);
    }
  }
};
</script>

<style scoped src="./BattleControlPanel.css" />
