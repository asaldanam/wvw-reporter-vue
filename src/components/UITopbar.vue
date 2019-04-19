<template>
  <div class="wrapper">
    <vue-flex-box
      class="container"
      align-items="center"
      justify-content="space-between"
    >
      <vue-flex-item>
        <img class="logo" src="@/assets/images/logo.png" alt="">
      </vue-flex-item>
      <vue-flex-item class="title">
        WvW Tracker
      </vue-flex-item>
    </vue-flex-box>
  </div>
</template>

<script>
  export default {
    name: 'UITopbar',
    props: {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>

  @import '~@/styles/settings';

  .container {
    height: 92px;
    padding: 0 1rem;
    width: 100%;
    background-image: url('../assets/images/header.png');
    background-repeat: no-repeat;
  }

  .logo {
    height: 56px;
    width: auto;
    margin-bottom: 12px;
  }

  .title {
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
    font-style: italic;
    margin-bottom: 2.5rem !important;
  }

</style>
