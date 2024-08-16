<template>
    <transition name="fade">
        <div class="BattleTutorial">
            <div class="BattleTutorial__container">
                <div class="BattleTutorial__title">
                    TUTORIAL
                </div>
                <div class="BattleTutorial__content">
                    <p class="BattkeTutorial__content-name">{{BattleTutorialContent[currentIndex].step}} </p>
                    <p class="BattleTutorial__content-description"> {{BattleTutorialContent[currentIndex].description}} </p>
                    <div class="BattleTutorial__content-image">
                        <img :src="BattleTutorialContent[currentIndex].imagePath">
                    </div>            
                </div>
                <div class="Battle__Tutorial-flow">
                    <div 
                    :class="['Battle__Tutorial-flow-item', { 'Battle__Tutorial-flow-item--selected': currentIndex === index }]"
                    v-for="(item, index) in 3" 
                    > 
                    </div>
                </div>
            
                <div class="BattleTutorial-bottom">
                    <div v-for="item in items" >
                        <BattleTutorialAnimationButton 
                        :text="item.text"
                        :image-path="item.imagePath"
                        :animationIamgePath="item.animationIamgePath"
                        @click="handleStep"             
                        />
                    </div>
                    
                </div>
            </div>

        </div>
    </transition>
</template>

<script lang="ts">
import BattleTutorialAnimationButton from '../BattleTutorialAnimationButton/BattleTutorialAnimationButton.vue';
import { BattleTutorialContent } from '@/constants';
export default {
    name: 'BattleTurorial',
    components: {
        BattleTutorialAnimationButton,
    },
    data() {
        return {
            items: [
                {text:"PREVIOUS",imagePath: '/gui/images/battle-tutorial/previous.svg', animationIamgePath: '/gui/images/battle-tutorial/previous-border.svg'},
                {text:"SKIP",imagePath: '/gui/images/battle-tutorial/skip.svg', animationIamgePath: '/gui/images/battle-tutorial/skip-border.svg'},
                {text:"NEXT",imagePath: '/gui/images/battle-tutorial/next.svg', animationIamgePath: '/gui/images/battle-tutorial/next-border.svg'}
            ],
            currentIndex: 1,
            BattleTutorialContent
        }
    },
    methods: {
        handleStep(text: String) {
            if(text == 'PREVIOUS') {
                if(this.currentIndex > 0)
                    this.currentIndex--
               
            }
            else if(text == 'NEXT') {
                if(this.currentIndex < 2)
                    this.currentIndex++
            }
        }
    }
}

</script>


<style scoped src="./BattleTutorial.css"></style>