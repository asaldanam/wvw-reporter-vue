<template>
  <div class="background">
    <div v-if="loading" class="bar"></div>
  </div>
</template>

<script>
  export default {
    name: 'UILoadingBar',
    props: {
      loading: Boolean
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>

  @import '~@/styles/settings';

  .background {
    background-color: #e2d3d3
  }

  .bar {
    width: 100%;
    height: 4px;
    background-image: 
      repeating-linear-gradient(
        -45deg,
        $color-primary,
        $color-primary 11px,
        transparent 10px,
        transparent 20px /* determines size */
      );
    background-size: 28px 28px;
    animation: loading_bar .5s linear infinite;
  }

</style>
