<template>
    <transition name="fade">
        <div class="PreGameCounterMode">
            <PreGameCountdown />
        </div>
    </transition>
</template>

<script lang="ts">
import { PreGameCountdown } from '@/components';

export default {
    name: 'PreGameCounterMode',
    components: {
        PreGameCountdown
    }
}
</script>

<style scoped src="./PreGameCounterMode.css" >
</style>
