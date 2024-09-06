<template>
    <div class="AudioMenu__container">
        <div class="AudioMenu">
            <div class="AudioMenu__previous" @click="changeStatus">
                <img src="/gui/images/duel-previous.svg">
            </div>
            <div class="AudioMenu__title --bold" @click="$emit('close')">SETTINGS</div>
            <div class="AudioMenu__close"></div>
            <img src="/gui/images/main-menu/main-menu-background.png">
            <div class="AudioMenu__items">
                <div class="AudioMenu__icon-item">
                    <div class="AudioMenu__icon-item-text">
                        Audio
                    </div>
                    <div class="AudioMenu__icon-item-img" @click="controlAudio">
                        <div :class="['AudioMenu__icon-item-icon', isOn ? 'on' : 'off']">
                        </div>
                    </div>

                </div>
                <!-- <div class="AudioMenu__setting-item">
                    SETTING
                </div>
                <div class="AudioMenu__setting-item">
                    SETTING
                </div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useSettingsStore } from '@/stores';
import { mapStores } from 'pinia';
export default {
    name: 'AudioMenu',
    computed: {
        ...mapStores(useSettingsStore),

    },
    data() {
        return {
            isOn: true,
        }
    },
    methods: {
        controlAudio() {
            this.isOn = !this.isOn;
            if(this.isOn == true)
                this.settingsStore.volume.changeMusicVolume(50)
            else 
                 this.settingsStore.volume.changeMusicVolume(0)
        },
        changeStatus() {
            this.$emit('previous', 'SETTINGS')
        }
    }
}

</script>

<style scoped src="./AudioMenu.css"></style>