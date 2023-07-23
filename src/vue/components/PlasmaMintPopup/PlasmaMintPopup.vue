<template>
  <div class="PlasmaMintPopup">
    <div class="PlasmaMintPopup__overlay"/>
    <div class="PlasmaMintPopup__box">
      <button class="PlasmaMintPopup__close" @click="$emit('close')"/>
      <div class="PlasmaMintPopup__head">
        <div class="PlasmaMintPopup__title">Get plasma</div>
      </div>
      <div class="PlasmaMintPopup__label">Amount:</div>
      <input class="PlasmaMintPopup__field" type="number" v-model="amount"/>
      <button class="PlasmaMintPopup__button" @click="submit" :disabled="pending">
        {{ pending ? 'Pending...' : 'Get plasma' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'PlasmaMintPopup',
  data: () => ({
    amount: 0,
    pending: false
  }),
  methods: {
    async submit() {
      this.pending = true
      await this.$wallet.mintPlasma(this.amount)
      this.pending = false
      this.$emit('close')
    }
  }
};
</script>

<style scoped src="./PlasmaMintPopup.css"></style>
