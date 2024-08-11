<template>
  <div class="SearchInput">
    <input
      ref="input"
      class="SearchInput__field"
      :value="modelValue"
      @input="handleValueChange"
    >
  </div>
</template>

<script lang="ts">
export default {
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      required: true
    },
  },
  methods: {
    handleValueChange(event) {
      this.$emit('update:modelValue', event.target?.value || '')
    }
  },
  mounted() {
    this.$refs.input?.focus()
  }
};
</script>

<style scoped src="./SearchInput.css"></style>
