<template>
    <div class="BattleTutorialAnimationButton" @click="handleClick">
        <img :src="this.imagePath" :style="computedStyle">
        <div class="BattleTutorialAnimationButton__text">
            {{ text }}
        </div>
          
        <div v-for="(item, index) in 8" 
            key="index" 
            class="BattleTutorialAnimationButton__item"         
        >   
            <img :src="this.animationIamgePath">
        </div>
    </div>

</template>

<script lang="ts">
    export default {
        name: 'BattleTutorialAnimationButton',
        props: {
            text: {
                type: String,
            },
            imagePath: {
                type:String,
            },
            animationIamgePath: {
                type: String,
            }
        },
        computed: {
            computedStyle(): { boxShadow?: string; borderRadius?: string } {
            const style: { boxShadow?: string; borderRadius?: string } = {};
            if (this.text?.toLowerCase() === 'previous') {
                style.boxShadow = '0px 0px 403.2px #1463DE, 0px 0px 230.4px #1463DE, 0px 0px 134.4px #1463DE, 0px 0px 67.2px #1463DE, 0px 0px 19.2px #1463DE, 0px 0px 9.6px #1463DE';
                style.borderRadius = '36px 8px 8px 36px'
            } else if (this.text?.toLowerCase() === 'skip') {
                style.boxShadow = '0px 0px 403.2px #F90E1C, 0px 0px 230.4px #F90E1C, 0px 0px 134.4px #F90E1C, 0px 0px 67.2px #F90E1C, 0px 0px 19.2px #F90E1C'
                style.borderRadius = '8px'; 
            }
            else {
                style.boxShadow = '0px 0px 403.2px #1463DE, 0px 0px 230.4px #1463DE, 0px 0px 134.4px #1463DE, 0px 0px 67.2px #1463DE, 0px 0px 19.2px #1463DE, 0px 0px 9.6px #1463DE';
                style.borderRadius = '8px 36px 36px 8px'; 
            }
      
            return style;
            }
        },
        methods: {
            handleClick() {
                this.$emit('click', this.text)
            }
        }
    }
</script>

<style scoped src="./BattleTutorialAnimationButton.css"></style>