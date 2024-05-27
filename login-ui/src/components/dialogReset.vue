<style lang="scss">
@import '../assets/modal.scss';
</style>

<template>
  <div>
    <h1>Token expired, please open email within 300s.</h1>
    <button @click="goBack">click here</button>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';

export default {
  methods: {
    goBack() {
      this.$router.push('/login');
    }
  }
}
</script>
