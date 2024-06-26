<template>
  <div class="StarPanel" :style="panelStyle">
    <button
      class="StarPanel__close"
      @click="$emit('close')"
    />
    <svg viewBox="0 0 854 638" class="StarPanel__svg">
      <defs>
        <radialGradient id="leftButtonGradient" cx="0.65" fx="0.65">
          <stop offset="30%" stop-color="rgb(0 255 255 / 0%)" />
          <stop offset="100%" stop-color="rgb(0 255 255 / 25%)" />
        </radialGradient>
        <radialGradient id="rightButtonGradient" cx="0.35" fx="0.35">
          <stop offset="30%" stop-color="rgb(0 255 255 / 0%)" />
          <stop offset="100%" stop-color="rgb(0 255 255 / 25%)" />
        </radialGradient>
      </defs>
      <g id="star-info">
        <g id="star-info-name">
          <text class="StarPanel__title" text-anchor="middle">
            <tspan x="436" y="76">Star: {{ star.name }}</tspan>
          </text>
        </g>
        <g id="star-info-description">
          <text class="StarPanel__text" text-anchor="middle">
            <tspan x="436" y="104">{{ description }}</tspan>
          </text>
        </g>
        <path
          id="star-info-inner"
          class="StarPanel__line is-thin is-second"
          d="M432,121.2h103.5c1.1,0,2.2,0.1,3.3,0.3c1.1,0.2,2.1,0.5,3.2,0.9c1,0.4,2,0.9,2.9,1.6
					c0.9,0.6,1.8,1.3,2.6,2.1l4,4l4,4l4,4l4,4c0.3,0.3,0.7,0.6,1.1,0.9s0.8,0.5,1.2,0.6c0.4,0.2,0.9,0.3,1.3,0.4
					c0.4,0.1,0.9,0.1,1.4,0.1h58c0.6,0,1.2-0.1,1.7-0.2s1.1-0.3,1.6-0.5c0.5-0.2,1-0.5,1.5-0.8c0.5-0.3,0.9-0.7,1.3-1.1l3.4-3.4
					l1.7-1.7c1.1-1.1,1.7-2.6,1.7-4.1c0-2.4,0-6,0-8.5c0-1.6,0.6-3,1.7-4.1l9.3-9.3l9.3-9.3c1.1-1.1,2.6-1.7,4.1-1.7c2.5,0,6.2,0,8.5,0
					c1.5,0,3-0.6,4.1-1.7l1.7-1.7l3.4-3.4c0.9-0.9,1.5-1.9,1.9-2.9s0.6-2.2,0.6-3.3c0-1.1-0.2-2.3-0.6-3.3c-0.4-1.1-1.1-2.1-1.9-2.9
					l-2.6-2.6l-2.6-2.7l-2.6-2.7l-2.6-2.6c-5.7-5.7-11.9-10.8-18.5-15.2s-13.5-8.1-20.8-11.1c-7.3-3-14.8-5.3-22.6-6.8
					c-7.8-1.5-15.7-2.3-23.8-2.3h-72c-0.3,0-0.6,0-0.8,0.1c-0.3,0-0.5,0.1-0.8,0.2c-0.3,0.1-0.5,0.2-0.7,0.4c-0.2,0.2-0.5,0.3-0.6,0.5
					l-1.2,1.2l-1.2,1.2l-1.2,1.2l-1.2,1.2c-0.7,0.7-1.4,1.3-2.2,1.8c-0.8,0.5-1.6,0.9-2.5,1.3s-1.8,0.6-2.7,0.8s-1.9,0.3-2.8,0.3h-95
					h-31.7c-0.9,0-1.9-0.1-2.8-0.3s-1.8-0.5-2.7-0.8c-0.9-0.4-1.7-0.8-2.5-1.3s-1.5-1.1-2.2-1.8l-1.2-1.2l-1.2-1.2l-1.2-1.2l-1.2-1.2
					c-0.2-0.2-0.4-0.4-0.6-0.5s-0.5-0.3-0.7-0.4c-0.3-0.1-0.5-0.2-0.8-0.2s-0.6-0.1-0.8-0.1h-18h-18h-18h-18c-8.1,0-16.1,0.8-23.8,2.3
					c-7.8,1.5-15.3,3.8-22.6,6.8s-14.2,6.7-20.8,11.1c-6.6,4.4-12.8,9.5-18.5,15.2l-2.7,2.6l-2.6,2.6l-2.6,2.6l-2.6,2.6
					c-0.9,0.8-1.5,1.8-1.9,2.9c-0.4,1.1-0.6,2.2-0.6,3.3c0,1.1,0.2,2.3,0.6,3.3c0.4,1.1,1.1,2.1,1.9,2.9l3.4,3.4l1.7,1.7
					c1.1,1.1,2.6,1.7,4.1,1.7c2.4,0,6,0,8.5,0c1.6,0,3,0.6,4.1,1.7l9.3,9.3l9.3,9.3c1.1,1.1,1.7,2.6,1.7,4.1c0,2.6,0,6.2,0,8.5
					c0,1.6,0.6,3,1.7,4.1l1.7,1.7l3.4,3.4c0.4,0.4,0.9,0.8,1.3,1.1c0.5,0.3,1,0.6,1.5,0.8c0.5,0.2,1.1,0.4,1.6,0.5
					c0.6,0.1,1.1,0.2,1.7,0.2h14.5h14.5h14.5h14.5c0.5,0,0.9,0,1.4-0.1c0.4-0.1,0.9-0.2,1.3-0.4c0.4-0.2,0.8-0.4,1.2-0.6
					c0.4-0.3,0.7-0.5,1.1-0.9l4-4l4-4l4-4l4-4c0.8-0.8,1.7-1.5,2.6-2.1c0.9-0.6,1.9-1.1,2.9-1.5s2.1-0.7,3.2-1c1.1-0.2,2.2-0.3,3.3-0.3
					h51.7L432,121.2L432,121.2z"
        />
        <path
          id="star-info-outer"
          class="StarPanel__line is-thin"
          d="M685.1,96c5.4-5.4,5.4-14.2,0-19.6l-10.6-10.6c-23.6-23.6-55.7-36.9-89.1-36.9h-72
					c-2.5,0-4.8,1-6.6,2.7l-4.9,4.9c-1.7,1.7-4.1,2.7-6.6,2.7H368.7c-2.5,0-4.8-1-6.6-2.7l-4.9-4.9c-1.7-1.7-4.1-2.7-6.6-2.7h-72
					c-33.4,0-65.5,13.3-89.1,36.9l-10.6,10.6c-5.4,5.4-5.4,14.2,0,19.6L228,145c2.6,2.6,6.1,4.1,9.8,4.1h58c3.2,0,6.2-1.3,8.5-3.5
					c5.2-5.2,9.9-9.9,15.9-15.9c2.2-2.2,5.3-3.5,8.5-3.5h206.9c3.2,0,6.2,1.3,8.5,3.5l15.9,15.9c2.2,2.2,5.3,3.5,8.5,3.5h58
					c3.7,0,7.2-1.5,9.8-4.1L685.1,96L685.1,96z"
        />
        <path
          id="star-info-curve"
          class="StarPanel__line is-thin is-second"
          d="M332.8,0.1l28,28l4.9,4.9c0.8,0.8,1.9,1.3,3,1.3h126.6c1.1,0,2.2-0.5,3-1.3l4.9-4.9
					l28-28"
        />
        <template v-if="isOwner">
          <g id="star-left-button" class="StarPanel__button" @click="boostExp">
            <path
              id="star-left-button-outline"
              class="StarPanel__line is-button is-aim"
              d="M237.8,141.8c-0.4,0-0.9,0-1.4-0.1c-0.4-0.1-0.8-0.2-1.3-0.4c-0.4-0.2-0.8-0.4-1.2-0.6c-0.4-0.3-0.7-0.6-1-0.8l-5.1-5.1c-0.7-0.7-1.1-1.7-1.1-2.7v-8.5c0-2.1-0.8-4.1-2.3-5.5l-18.7-18.7c-1.5-1.5-3.4-2.3-5.5-2.3h-8.5c-1,0-2-0.4-2.7-1.1l-5.1-5.1c-0.6-0.6-1.2-1.4-1.5-2.3c-0.3-0.8-0.5-1.7-0.5-2.6c0-0.9,0.2-1.8,0.5-2.6c0.3-0.8,0.8-1.6,1.5-2.2l2.6-2.6l5.3-5.3l2.6-2.6c5.6-5.6,11.7-10.6,18.2-14.9c6.4-4.3,13.3-8,20.4-10.9c7.1-3,14.6-5.2,22.2-6.7c7.6-1.5,15.5-2.3,23.4-2.3h37.2c2.3,0,4.2,1.9,4.2,4.2v78.6c0,1.5-0.8,2.8-2,3.6c0,0,0,0,0,0c-1,0.7-2,1.5-2.9,2.4l-15.9,15.9c-0.2,0.2-0.5,0.4-0.8,0.6c-0.3,0.2-0.5,0.3-0.8,0.5c-0.3,0.1-0.6,0.2-0.9,0.3s-0.7,0.1-1,0.1L237.8,141.8L237.8,141.8z"
            />
            <text class="StarPanel__text" text-anchor="middle">
              <tspan x="266" y="86">BOOST</tspan>
              <tspan x="266" y="106">EXP.</tspan>
            </text>
          </g>
          <g id="star-left-button" class="StarPanel__button" @click="boostNrg">
            <path
              id="star-right-button-outline"
              class="StarPanel__line is-aim is-button is-right"
              d="M626.2,141.8c0.4,0,0.9,0,1.4-0.1c0.4-0.1,0.8-0.2,1.3-0.4c0.4-0.2,0.8-0.4,1.2-0.6c0.4-0.3,0.7-0.6,1-0.8l5.1-5.1c0.7-0.7,1.1-1.7,1.1-2.7v-8.5c0-2.1,0.8-4.1,2.3-5.5l18.7-18.7c1.5-1.5,3.4-2.3,5.5-2.3h8.5c1,0,2-0.4,2.7-1.1l5.1-5.1c0.6-0.6,1.1-1.4,1.5-2.3c0.3-0.8,0.5-1.7,0.5-2.6c0-0.9-0.2-1.8-0.5-2.6c-0.3-0.8-0.9-1.6-1.5-2.2l-2.6-2.6l-5.3-5.3l-2.6-2.6c-5.6-5.6-11.7-10.6-18.2-14.9c-6.4-4.3-13.3-8-20.4-10.9c-7.1-3-14.6-5.2-22.2-6.7c-7.7-1.5-15.5-2.3-23.4-2.3h-37.2c-2.3,0-4.2,1.9-4.2,4.2v78.6c0,1.5,0.8,2.8,2,3.6c0,0,0,0,0,0c1,0.7,2,1.5,2.9,2.4l15.9,15.9c0.2,0.2,0.5,0.4,0.8,0.6c0.3,0.2,0.5,0.3,0.8,0.5c0.3,0.1,0.6,0.2,0.9,0.3c0.3,0.1,0.7,0.1,1,0.1L626.2,141.8L626.2,141.8z"
            />
            <text class="StarPanel__text" text-anchor="middle">
              <tspan x="600" y="86">BOOST</tspan>
              <tspan x="600" y="106">NRG.</tspan>
            </text>
          </g>
        </template>
      </g>
      <g id="data-output">
        <g id="data-output-value">
          <text class="StarPanel__text" text-anchor="middle">
            <tspan x="436" y="176">{{ activeParamValue }} {{ activeParamUnit }}</tspan>
          </text>
        </g>
        <path
          id="data-output-outer"
          class="StarPanel__line"
          d="M310.4,170.5l20.9,20.9c0.4,0.4,0.9,0.6,1.4,0.6h198.6c0.5,0,1-0.2,1.4-0.6l20.9-20.9
					c0.8-0.8,0.8-2.1,0-2.8l-20.9-20.9c-0.4-0.4-0.9-0.6-1.4-0.6H332.7c-0.5,0-1,0.2-1.4,0.6l-20.9,20.9
					C309.6,168.4,309.6,169.7,310.4,170.5z"
        />
        <path
          id="data-output-inner"
          class="StarPanel__line is-thin"
          d="M334,187L316,169.1l17.9-17.9h196.1l17.9,17.9L530.1,187H334z"
        />
      </g>
      <g id="level-info">
        <text dy="-20" class="StarPanel__text">
          <textPath xlink:href="#level-info-3-line" text-anchor="middle" startOffset="50%">
            Level
          </textPath>
        </text>
        <g id="level-info-5">
          <path
            id="level-info-5-box"
            class="StarPanel__line"
            d="M87,205.2l-17.7-9.4c16.4-31.1,37.5-59.6,62.8-84.8l14.1,14.1
						C122.4,149,102.5,175.9,87,205.2L87,205.2z"
          />
          <path
            id="level-info-5-line"
            class="StarPanel__line is-second"
            d="M139.1,118.1c-24.7,24.7-45.1,52.4-61,82.4"
          />
          <path
            v-if="star.params.level > 4"
            id="level-info-5-active"
            class="StarPanel__line is-progress"
            d="M139.1,118.1c-24.7,24.7-45.1,52.4-61,82.4"
          />
        </g>
        <g id="level-info-4">
          <path
            id="level-info-4-box"
            class="StarPanel__line"
            d="M53.4,304l-19.7-3.4c5.7-33.3,16.1-65.5,31-95.6l17.9,8.8
						C68.6,242.3,58.8,272.6,53.4,304L53.4,304z"
          />
          <path
            id="level-info-4-line"
            class="StarPanel__line is-second"
            d="M43.5,302.3c5.5-32.4,15.7-63.6,30.1-92.9"
          />
          <path
            v-if="star.params.level > 3"
            id="level-info-4-active"
            class="StarPanel__line is-progress"
            d="M43.5,302.3c5.5-32.4,15.7-63.6,30.1-92.9"
          />
        </g>
        <g id="level-info-3">
          <path
            id="level-info-3-box"
            class="StarPanel__line"
            d="M32.1,411.2c-2.3-16.5-3.5-33.4-3.5-50.2s1.2-33.7,3.5-50.2l19.8,2.8
						c-2.2,15.6-3.3,31.5-3.3,47.4s1.1,31.8,3.3,47.4L32.1,411.2z"
          />
          <path
            id="level-info-3-line"
            class="StarPanel__line is-second"
            d="M41.8,409.2c-4.6-32.6-4.4-65.4,0.4-97.6"
          />
          <path
            v-if="star.params.level > 2"
            id="level-info-3-active"
            class="StarPanel__line is-progress"
            d="M41.8,409.2c-4.6-32.6-4.4-65.4,0.4-97.6"
          />
        </g>
        <g id="level-info-2">
          <path
            id="level-info-2-box"
            class="StarPanel__line"
            d="M64.6,517c-14.9-30.1-25.3-62.3-31-95.6l19.7-3.4c5.4,31.4,15.2,61.7,29.2,90.1
						L64.6,517L64.6,517z"
          />
          <path
            id="level-info-2-line"
            class="StarPanel__line is-second"
            d="M73.8,512.1c-14.7-29.4-25-60.6-30.7-92.7"
          />
          <path
            v-if="star.params.level > 1"
            id="level-info-2-active"
            class="StarPanel__line is-progress"
            d="M73.8,512.1c-14.7-29.4-25-60.6-30.7-92.7"
          />
        </g>
        <g id="level-info-1">
          <path
            id="level-info-1-box"
            class="StarPanel__line"
            d="M132.1,610.9c-25.2-25.2-46.3-53.8-62.8-84.8l17.7-9.3c15.5,29.3,35.4,56.2,59.2,80
						L132.1,610.9L132.1,610.9z"
          />
          <path
            id="level-info-1-line"
            class="StarPanel__line is-second"
            d="M139,603.5c-23.5-23-45.1-53.5-61-82"
          />
          <path
            v-if="star.params.level > 0"
            id="level-info-1-active"
            class="StarPanel__line is-progress"
            d="M139,603.5c-23.5-23-45.1-53.5-61-82"
          />
        </g>
      </g>
      <g id="mass-level">
        <text dy="-12" class="StarPanel__text is-clickable" @click="selectParam('mass')">
          <textPath xlink:href="#mass-level-line" text-anchor="middle" startOffset="50%">
            Mass
          </textPath>
        </text>
        <path id="mass-level-start" class="StarPanel__line" d="M181.6,561.4l-14.1,14.1" />
        <path
          id="mass-level-line"
          class="StarPanel__line is-second"
          d="M174.5,568.5C119.1,513.1,88.6,439.4,88.6,361s30.5-152.1,85.9-207.5"
        />
        <transition name="fade">
          <path
            v-if="activeParam.mass"
            id="mass-level-line-active"
            class="StarPanel__line"
            d="M174.5,568.5C119.1,513.1,88.6,439.4,88.6,361s30.5-152.1,85.9-207.5"
          />
        </transition>
        <path
          :style="getParamProgressStyle(462, star.hud.mass.percent)"
          id="mass-level-line-progress"
          class="StarPanel__line is-progress"
          d="M174.5,568.5C119.1,513.1,88.6,439.4,88.6,361s30.5-152.1,85.9-207.5"
        />
        <transition name="fade">
          <path
            v-if="!activeParam.mass"
            id="mass-level-end"
            class="StarPanel__line"
            d="M167.4,146.4l14.1,14.1"
          />
        </transition>
        <transition name="fade">
          <path
            v-if="activeParam.mass"
            id="mass-level-connector"
            class="StarPanel__line"
            d="M174.5,153.5l9.5-9.8c3.9-3.9,10.2-3.9,14.1,0l15.4,15.4c6.4,6.4,14.9,9.9,24,9.9
					h72"
          />
        </transition>
      </g>
      <g id="slots-level">
        <text dy="-12" class="StarPanel__text is-clickable" @click="selectParam('slots')">
          <textPath xlink:href="#slots-level-line" text-anchor="middle" startOffset="50%">
            Slots
          </textPath>
        </text>
        <path id="slots-level-start" class="StarPanel__line" d="M216.9,526.1l-14.1,14.1" />
        <path
          id="slots-level-line"
          class="StarPanel__line is-second"
          d="M209.9,533.1c-46-46-71.3-107.1-71.3-172.1s25.3-126.2,71.3-172.1"
        />
        <transition name="fade">
          <path
            v-if="activeParam.slots"
            id="slots-level-line-active"
            class="StarPanel__line"
            d="M209.9,533.1c-46-46-71.3-107.1-71.3-172.1s25.3-126.2,71.3-172.1"
          />
        </transition>
        <path
          :style="getParamProgressStyle(382, star.hud.slots.percent)"
          id="slots-level-line-progress"
          class="StarPanel__line is-progress"
          d="M209.9,533.1c-46-46-71.3-107.1-71.3-172.1s25.3-126.2,71.3-172.1"
        />
        <transition name="fade">
          <path
            v-if="!activeParam.slots"
            id="slots-level-end"
            class="StarPanel__line"
            d="M203.3,181.8l14.1,14.1"
          />
        </transition>
        <transition name="fade">
          <path
            v-if="activeParam.slots"
            id="slots-level-connector"
            class="StarPanel__line"
            d="M310,169.1h-76c-2.5-0.2-5,0.8-6.9,2.7l-16.9,16.9"
          />
        </transition>
      </g>
      <g id="total-energy-level">
        <text dy="-12" class="StarPanel__text is-clickable" @click="selectParam('totalEnergy')">
          <textPath xlink:href="#total-energy-level-line" text-anchor="middle" startOffset="50%">
            Total energy
          </textPath>
        </text>
        <path id="total-energy-level-start" class="StarPanel__line" d="M647.6,525.8l14.1,14.1" />
        <path
          id="total-energy-level-line"
          class="StarPanel__line is-second"
          d="M654.1,188.9c46,46,71.3,107.1,71.3,172.1s-25.3,126.2-71.3,172.1"
        />
        <transition name="fade">
          <path
            v-if="activeParam.totalEnergy"
            id="total-energy-level-line-active"
            class="StarPanel__line"
            d="M654.1,188.9c46,46,71.3,107.1,71.3,172.1s-25.3,126.2-71.3,172.1"
          />
        </transition>
        <path
          :style="getParamProgressStyle(382, star.hud.totalEnergy.percent)"
          id="total-energy-level-line-progress"
          class="StarPanel__line is-progress"
          d="m654.1,532.89998c46,-45.94654 71.3,-106.97554 71.3,-171.9s-25.3,-126.05334 -71.3,-171.9"
        />
        <transition name="fade">
          <path
            v-if="!activeParam.totalEnergy"
            id="total-energy-level-end"
            class="StarPanel__line"
            d="M660.8,181.8l-14.1,14.1"
          />
        </transition>
        <transition name="fade">
          <path
            v-if="activeParam.totalEnergy"
            id="total-energy-level-connector"
            class="StarPanel__line"
            d="M554.2,169.1h76c2.7,0,5.2,1.1,7.1,2.9l16.9,16.9"
          />
        </transition>
      </g>
      <g id="energy-per-hour-level">
        <text dy="-12" class="StarPanel__text is-clickable" @click="selectParam('energyPerHour')">
          <textPath xlink:href="#energy-per-hour-level-line" text-anchor="middle" startOffset="50%">
            Energy per hour
          </textPath>
        </text>
        <path id="energy-per-hour-level-start" class="StarPanel__line" d="M682.4,561.4l14.1,14.1" />
        <path
          id="energy-per-hour-level-line"
          class="StarPanel__line is-second"
          d="M689.5,153.5c55.4,55.4,85.9,129.1,85.9,207.5s-30.5,152.1-85.9,207.5"
        />
        <transition name="fade">
          <path
            v-if="activeParam.energyPerHour"
            id="energy-per-hour-level-line-active"
            class="StarPanel__line"
            d="M689.5,153.5c55.4,55.4,85.9,129.1,85.9,207.5s-30.5,152.1-85.9,207.5"
          />
        </transition>
        <path
          :style="getParamProgressStyle(462, star.hud.energyPerHour.percent)"
          id="energy-per-hour-level-line-progress"
          class="StarPanel__line is-progress"
          d="m689.5,568.50002c55.4,-55.26651 85.9,-128.78892 85.9,-207.00001s-30.5,-151.7335 -85.9,-207.00001"
        />
        <transition name="fade">
          <path
            v-if="!activeParam.energyPerHour"
            id="energy-per-hour-level-end"
            class="StarPanel__line"
            d="M696.6,146.4l-14.1,14.1"
          />
        </transition>
        <transition name="fade">
          <path
            v-if="activeParam.energyPerHour"
            id="energy-per-hour-level-connector"
            class="StarPanel__line"
            d="M689.8,153.8l-10.1-10.1c-3.9-3.9-10.2-3.9-14.1,0l-15.4,15.4
					c-6.4,6.4-14.9,9.9-23.9,9.9h-72"
          />
        </transition>
      </g>
      <g id="life-level">
        <text dy="-12" class="StarPanel__text is-clickable" @click="selectParam('life')">
          <textPath xlink:href="#life-level-line" text-anchor="middle" startOffset="50%">
            Life
          </textPath>
        </text>
        <path id="life-level-start" class="StarPanel__line" d="M731.9,610.9l-14.1-14.1" />
        <path
          id="life-level-line"
          class="StarPanel__line is-second"
          d="M724.9,118.1C789.7,183,825.4,269.3,825.4,361s-35.7,178-100.6,242.8"
        />
        <transition name="fade">
          <path
            v-if="activeParam.life"
            id="life-level-line-active"
            class="StarPanel__line"
            d="M724.9,118.1C789.7,183,825.4,269.3,825.4,361s-35.7,178-100.6,242.8"
          />
        </transition>
        <path
          :style="getParamProgressStyle(540, star.hud.life.percent)"
          id="life-level-line-progress"
          class="StarPanel__line is-progress"
          d="m724.9,604.09984c64.8,-64.98015 100.5,-151.38674 100.5,-243.19999s-35.7,-178.21984 -100.6,-243.09987"
        />
        <transition name="fade">
          <path
            v-if="!activeParam.life"
            id="life-level-end"
            class="StarPanel__line"
            d="M732.1,111L718,125.1"
          />
        </transition>
        <transition name="fade">
          <path
            v-if="activeParam.life"
            id="life-level-connector"
            class="StarPanel__line"
            d="M553.8,169.2h72.6c9,0,17.6-3.6,23.9-9.9l50.8-50.8c3.9-3.9,10.2-3.9,14.1,0
					l9.8,9.8"
          />
        </transition>
      </g>
      <g id="aim">
        <g id="aim-right">
          <path
            class="StarPanel__line is-aim"
            d="M625.5,309.7c4.4,16.6,6.6,33.9,6.6,51.3s-2.2,34.6-6.6,51.3"
          />
          <path
            class="StarPanel__line is-aim is-third"
            d="M615.8,409.7c4.2-15.8,6.3-32.2,6.3-48.7s-2.1-32.9-6.3-48.7"
          />
          <path
            class="StarPanel__line is-aim is-second"
            d="M620.6,311c4.2,16,6.5,32.7,6.5,50s-2.3,34-6.5,50"
          />
          <path class="StarPanel__line is-aim" d="M665.4,361h-33.3" />
        </g>
        <g id="aim-left">
          <path
            class="StarPanel__line is-aim"
            d="M238.5,309.7c-4.4,16.6-6.6,33.9-6.6,51.3s2.2,34.6,6.6,51.3"
          />
          <path
            class="StarPanel__line is-aim is-third"
            d="M248.2,409.7c-4.2-15.8-6.3-32.2-6.3-48.7s2.1-32.9,6.3-48.7"
          />
          <path
            class="StarPanel__line is-aim is-second"
            d="M243.4,411c-4.2-16-6.5-32.7-6.5-50s2.3-34,6.5-50"
          />
          <path class="StarPanel__line is-aim" d="M231.9,361h-33.3" />
        </g>
      </g>
      <template v-if="isOwner">
        <transition name="fade">
          <g id="exp" v-if="!fetching">
            <text class="StarPanel__text" text-anchor="middle">
              <tspan x="430" y="525">EXP.</tspan>
            </text>
            <path id="exp-left" class="StarPanel__line" d="M272.3,524.2v20" />
            <path id="exp-line" class="StarPanel__line" d="M272.3,534h319.4" />
            <path
              :style="getParamProgressStyle(320, expPercent)"
              id="exp-progress"
              class="StarPanel__line is-progress"
              d="M272.3,534h319.4"
            />
            <path id="exp-right" class="StarPanel__line" d="M591.7,524v20" />
          </g>
        </transition>
      </template>
    </svg>
  </div>
</template>

<script lang="ts">
import { StarHudParam } from '@/models';
import { useStarsStore, useWalletStore } from '@/stores';
import { formatNumber, MyMath } from '@/utils';
import { mapStores } from 'pinia';

export default {
  name: 'StarPanel',
  props: {
    starId: {
      type: Number
    },
    scale: {
      type: Number
    }
  },
  data: (): {
    creationCost: number;
    fetching: boolean;
    selectedParam: StarHudParam;
  } => ({
    creationCost: 0,
    fetching: false,
    selectedParam: 'mass'
  }),
  computed: {
    ...mapStores(useStarsStore, useWalletStore),
    star() {
      return this.starsStore.getById(this.starId);
    },
    isOwner() {
      return this.walletStore.isOwner(this.star.owner);
    },
    description() {
      return `Federation of ${this.star.description.toLowerCase()}`;
    },
    activeParam(): Record<StarHudParam, boolean> {
      return {
        mass: this.selectedParam === 'mass',
        slots: this.selectedParam === 'slots',
        totalEnergy: this.selectedParam === 'totalEnergy',
        energyPerHour: this.selectedParam === 'energyPerHour',
        life: this.selectedParam === 'life'
      };
    },
    activeParamValue(): string {
      return formatNumber(this.star.hud[this.selectedParam].value);
    },
    activeParamUnit(): string {
      return this.star.hud[this.selectedParam].unit;
    },
    panelStyle() {
      return {
        // transform: `scale(${this.scale})`
      };
    },
    expPercent() {
      return Math.min(this.star.levelUpFuel / this.creationCost, 1);
    }
  },
  watch: {
    star: function () {
      this.fetchData();
    }
  },
  methods: {
    // value 0...1
    getParamProgressStyle(dasharray: number, value: number) {
      const offset = dasharray - dasharray * value

      return {
        'stroke-dasharray': `${dasharray}px`,
        'stroke-dashoffset': `${MyMath.clamp(offset, 0, dasharray)}px`
      };
    },
    selectParam(param: StarHudParam) {
      this.selectedParam = param;
    },
    boostExp() {
      this.$emit('callStarBoost', { type: 'exp', starId: this.star.id });
    },
    boostNrg() {
      this.$emit('callStarBoost', { type: 'energy', starId: this.star.id });
    },
    async fetchData() {
      this.creationCost = await this.$wallet.provider.getCreationCost(this.star.params.level + 1);
    }
  },
  async created() {
    this.fetching = true;
    await this.fetchData();
    this.fetching = false;
  }
};
</script>

<style scoped src="./StarPanel.css"></style>
