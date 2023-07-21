<template>
  <input
    class="SearchInput"
    :value="modelValue"
    @input="handleValueChange"
  >
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
    this.$el.focus()
  }
};
</script>

<style scoped src="./SearchInput.css"></style>
