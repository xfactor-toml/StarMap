<template>
    <BaseModal 
    :title="title" 
    :subtitle="subtitle" 
    :buttonName="buttonName" 
    :buttonType="buttonType" 
    @close="closeModal" >
        <QuestRewardList :rewardsList="rewardsList"></QuestRewardList>
    </BaseModal>
</template>
<script lang="ts">
import BaseModal from './BaseModal/BaseModal.vue';
import RewardItem from '../QuestsItem/RewardItem';
import QuestRewardList from '../QuestsRewardList';
import { BonusType } from '@/types/quest';
export default {
    name: 'QuestsModal',
    components: {
        BaseModal,
        RewardItem,
        QuestRewardList,
    },
    props: {
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
        },
        rewardsList: {
            type: Array as () => BonusType[],
            default: () => []
        }
    },  
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
}
</script>
<style scoped src=""></style>