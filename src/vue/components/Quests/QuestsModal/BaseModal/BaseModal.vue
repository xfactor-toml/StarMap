<template>
    <div class="BaseModal" :class="`--${bgColor}`">
        <h3 class="BaseModal__title">{{ title }}</h3>
        <div class="BaseModal__closebtn --bold" @click="closeModal">
            <img src="/gui/images/user-inventory/inventory/close.svg" alt="close">
        </div>
        <div class="BaseModal__body">
            <h4 class="BaseModal__subtitle">{{ subtitle }}</h4>
            <div class="BaseModal__content">
                <div class="BaseModal__content-middleline" />
                <div class="BaseModal__content-rewards">
                    <slot>
                        <!-- <div class="BaseModal__content-rewards-item">
                            <RewardItem :bonusCount="10" :isRewardDay="true" :isNFT="true" />
                        </div> -->
                    </slot>
                </div>
            </div>
        </div>
        <div class="BaseModal__btn">
            <AnimationButton :buttonType="buttonType"/>
        </div>
    </div>
</template>
<script lang="ts">
import AnimationButton from '@/components/AnimationButton';
import RewardItem from '@/components/Quests/QuestsItem/RewardItem/RewardItem.vue';
export default {
    name: 'BaseModal',
    components: {
        AnimationButton,
        RewardItem
    },
    props: {
        bgColor: {
            type: String,
            default: 'yellow'
        },
        title: {
            type: String,
            default: 'UNSTOPPABLE'
        },
        subtitle: {
            type: String,
            default: 'Your rewards'
        },
        buttonName: {
            type: String,
            default: 'OPENBOX'
        },
        buttonType: {
            type: String,
            default: 'yellow'
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>
<style scoped src="./BaseModal.css"></style>