<template>
    <div class="GoldScore">
        <div class="GoldScore__image">
            <svg viewBox="0 0 1073 159" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1023.48 76.8C1020.11 70.9601 1015.22 66.0701 1009.33 62.6801C1003.45 59.2901 996.77 57.49 990.03 57.49H745.17L743.5 57.52H327.82L327.84 57.49H82.9701C76.2201 57.49 69.5501 59.2801 63.6701 62.6801C57.7901 66.0801 52.9001 70.9601 49.5301 76.8L2.52014 158.22L0.140137 156.85L47.1501 75.4301C50.7601 69.1701 56.0001 63.94 62.3001 60.3C68.6001 56.66 75.7501 54.74 82.9801 54.74H324C327.29 54.74 330.32 52.94 331.9 50.05L355.79 6.26001C357.72 2.72001 361.42 0.530029 365.45 0.530029H707.58C711.61 0.530029 715.31 2.73001 717.24 6.26001L741.13 50.05C742.71 52.94 745.74 54.74 749.03 54.74H990.05C997.28 54.74 1004.43 56.66 1010.73 60.3C1017.03 63.94 1022.27 69.1701 1025.88 75.4301L1072.89 156.85L1070.51 158.23L1023.5 76.8101L1023.48 76.8Z"
                    fill="url(#paint0_linear_1_3776)" />
                <defs>
                    <linearGradient id="paint0_linear_1_3776" x1="536.5" y1="0.530029" x2="536.5" y2="158.22"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00FFFF" />
                        <stop offset="1" stop-color="#00FFFF" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>

        </div>

        <div class="GoldScore__score" @click="$emit('click')">
            <span class="">SHOP | </span>
            <span class="GoldScore__text">{{ score }} GOLD</span>
        </div>

    </div>
</template>
<script lang="ts">
export default {
    name: 'GoldScore',
    props: {
        score: {
            type: Number,       
        }
    },
    emits: ['click']
}
</script>

<style scoped src="./GoldScore.css" />
