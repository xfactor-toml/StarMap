<template>
    <!-- First SVG for unique quests -->
    <svg v-if="questType === 'UNIQUE'" width="374" height="27" viewBox="0 0 374 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_i_76_338)">
    <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00001 26 -9.99999 26C-10.2156 62.5901 -9.99997 127.5 -10 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" fill="#1E1E1E"/>
    </g> 
    <path d="M121.532 1C115.796 1 110.188 3.32638 106.133 7.38638L92.4453 22C90.9552 23.4919 87.4453 26 83.4453 26C80.6388 26 2.00001 26 -9.99999 26C-10.2156 62.5901 -9.99997 127.5 -10 157.5C11.5 157.5 359.5 157.5 384 157.5C384 143.5 384 58 384 26C377 26 294.32 26 292.445 26C287.945 26 283.857 23.4131 282.445 22L266.995 7.38638C262.911 3.29725 257.372 1.00001 251.596 1L121.532 1Z" :stroke="strokeColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
    <filter id="filter0_i_76_338" x="-11.0958" y="0" width="396.096" height="162.5" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="5"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_76_338"/>
    </filter>
    </defs>
    </svg>

    <!-- Second SVG for non-unique quests -->
    <svg v-else width="213" height="27" viewBox="0 0 213 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40.0865 0C34.3505 4.17113e-07 28.7424 2.32638 24.6875 6.38638L11 21C9.50995 22.4919 6 25 1.99999 25C-6.5 25 24.6119 36 40.0865 36H170.151C184.281 36 220 25 211 25C206.5 25 202.411 22.4131 201 21L185.55 6.38638C181.466 2.29725 175.927 7.9065e-06 170.151 0L40.0865 0Z" :fill="strokeColor"/>
    </svg>
</template>
<script>
export default {
    name: 'QuestsBottomSvg',
    props: {
        strokeColor: String,
        questType: String
        
    }
}
</script>
<style lang="">
    
</style>