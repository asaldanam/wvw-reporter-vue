<template>
  <div class="form-group">
    <select :value="value"
            @change="setValue($event.target.value)">
      <option disabled :selected="value == null">Please select one</option>
      <option v-for="option in options" 
              :key="option.value"
              :selected="option.value == value"
              :value="option.value">
        {{option.text}}
      </option>
    </select>
    <img class="icon-dropdown" src="@/assets/images/icons/ic-grey-24-dropdown.svg" alt="dropdown">
  </div>
</template>

<script>
  export default {
    name: 'UISelect',
    props: {
      value: {
        default() {
          return ''
        }
      },
      options: {
        type: Array,
        require: true
      },
    },
    methods: {
      setValue(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import '~@/styles/settings';

  .form-group {
    position: relative;
  }

  .icon-dropdown {
    position: absolute;
    right: 6px;
    top: 7px;
  }

  select {
    display: block;
    width: 100%;
    box-shadow: inset 0 0 5px 0 #c1c1c1;
    background-color: #fcfcfc;
    color: #505050;
    font-weight: 400;
    border: solid 1px #b5b5b5;
    padding: 6px 15px;
    line-height: 25px;
    font-size: 16px;
  }

</style>
