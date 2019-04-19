<template>
  <div class="toast"
    v-if="show"
    :class="{
      '_error': type === 'error'
    }"
  >
    <img class="icon" src="@/assets/images/icons/ic-white-24-error.svg" alt="">
    <span class="msg">{{msgTxt}}</span>
  </div>
</template>

<script>
  export default {
    name: 'UIToast',
    props: {
      show: Boolean,
      msgTxt: String,
      type: String,
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>

  @import '~@/styles/settings';

  .toast {
    padding: 0.5rem 1rem;
    color: white;
    font-size: 14px;
    &._error {
      background-color: red;
    }
  }

  .icon {
    margin-right: 4px;
    width: 16px;
  }

</style>
