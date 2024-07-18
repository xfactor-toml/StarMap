<template>
    <div class="BattleControlPanel">
        <div class="BattleControlPanel__row">
            <ThunderTrading />
            <VelocityVectorsTrading />
            <NuclearOrbTrading />
            <SpiralSentinelTrading />

        </div>
        <div class="BattleControlPanel__row">
            <AccelerationAmuletTrading />
            <SurgeSpiresTrading />
            <MomentumMatrixTrading />
            <QuantumBoosterTrading />
        </div>
    </div>
</template>

<script lang="ts">
import {
    ThunderTrading,
    AccelerationAmuletTrading,
    MomentumMatrixTrading,
    NuclearOrbTrading,
    QuantumBoosterTrading,
    SpiralSentinelTrading,
    SurgeSpiresTrading,
    VelocityVectorsTrading,
} from './tradings';

export default {
    name: "BattleShop",
    components: {
        ThunderTrading,
        AccelerationAmuletTrading,
        MomentumMatrixTrading,
        NuclearOrbTrading,
        QuantumBoosterTrading,
        SpiralSentinelTrading,
        SurgeSpiresTrading,
        VelocityVectorsTrading,
    },
};
</script>

<style scoped src="./BattleShop.css" />