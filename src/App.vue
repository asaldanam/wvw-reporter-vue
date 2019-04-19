<template>
  <div id="app">
    <UITopbar/>
    <router-view/>
  </div>
</template>

<script>
import UITopbar from '@/components/UITopbar.vue'
export default {
  components: {
    UITopbar
  },
}
</script>


<style lang="scss">
  @import '~@/styles/reset';
  @import '~@/styles/fonts'; 
  @import '~@/styles/settings'; 

  body {
    font-family: 'cronos', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    background-image: url('./assets/images/background.png');
    background-color: white;
    background-repeat: no-repeat;
    background-position: center 92px;
    // background-size: contain;
  }

  * {
    box-sizing: border-box;
  }

  #app {
    color: $color_fontMain;
  }

</style>
