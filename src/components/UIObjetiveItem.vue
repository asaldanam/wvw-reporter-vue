<template>
  <div>
    <vue-flex-box
      class="container"
      align-items="center"
      :gap="16"
    >
      <!-- objetive icon -->
      <vue-flex-item class="icon" :class="{
        '_red': owner === 'Red',
        '_green': owner === 'Green',
        '_blue': owner === 'Blue',
      }">
        <img v-if="type === 'Camp'" src="../assets/images/camp.png" alt="">
        <img v-if="type === 'Tower'" src="../assets/images/tower.png" alt="">
        <img v-if="type === 'Ruins'" src="../assets/images/camp.png" alt="">
        <img v-if="type === 'Keep'" src="../assets/images/keep.png" alt="">
        <img v-if="type === 'Castle'" src="../assets/images/castle.png" alt="">
      </vue-flex-item>

      <!-- Name -->
      <vue-flex-item class="name">
        <span>{{name}}</span>
      </vue-flex-item>

      <!-- Time-->
      <vue-flex-item class="timer"
        :class="{'_locked': status === 'locked'}"
      >
        <span>{{timer}}</span>
        <img v-if="status === 'locked'" src="@/assets/images/ri.png" alt="">
      </vue-flex-item>

    </vue-flex-box>
  </div>
</template>

<script>
import { setInterval } from 'timers';
  export default {
    name: 'UIObjetiveItem',

    props: {
      name: String,
      type: String,
      lastFlipped: String,
      owner: String,
      correction: Number
    },
    data() {
      return {
        timer: '',
        status: ''
      }
    },
    created() {
      this.calcTimer(this.lastFlipped);
      setInterval(() => {
        this.calcTimer(this.lastFlipped);
      }, 1000)
    },

    methods: {

      _format(date, substr, units) {
        const deleteZeros = string => {
          return string.charAt(0) === '0'
            ? string.substring(1)
            : string;
        }

        const splittedDate = date.toISOString().substr(substr[0], substr[1]).split(':');
        const firstUnit = splittedDate[0] + units[0];
        const secondUnit = splittedDate[1] && units[1] ? splittedDate[1] + units[1] : '';

        return `${deleteZeros(firstUnit)} ${deleteZeros(secondUnit)}`;
      },

      calcTimer(ISOTimePoint) {
        // aplica la correción al lastFlipped
        const secondsFromFlipped = this.$moment().diff(ISOTimePoint, 'seconds') + this.correction

        // genera un date para formatear la fecha
        const date = new Date(null);

        //menos de 5 minutos
        if (secondsFromFlipped <= 300) {
          date.setSeconds(300 - secondsFromFlipped);
          // this.timer = date.toISOString().substr(15, 4);
          this.timer = this._format(date, [14, 5], ['m', 's'])
          this.status = 'locked'
        } 
        // menos de 1 hora
        else if (secondsFromFlipped <= 3600) {
          date.setSeconds(secondsFromFlipped);
          // this.timer = date.toISOString().substr(14, 5);
          this.timer = this._format(date, [14, 5], ['m'])
          this.status = ''
        }
        // menos de 24h
        else if (secondsFromFlipped <= (3600 * 24)) {
          date.setSeconds(secondsFromFlipped);
          // this.timer = date.toISOString().substr(11, 5);
          this.timer = this._format(date, [11, 5], ['h', 'm'])
          this.status = ''
        }
        // a partir de 24h
        else {
          date.setSeconds(secondsFromFlipped);
          this.timer = '+24h'
          this.status = ''
        }

      },

      getImage(objetiveType) {
        const objetiveTypes = {
          'Keep': 'keep',
          'Tower': 'tower',
          'Ruins': 'ruins',
          'Camp': 'camp',
        }
        return objetiveTypes[objetiveType]
      }

    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/settings';

  .container {
    width: 100%;
    margin-bottom: 0.5rem
  }

  .name {
    font-size: 18px;
  }

  .icon {
    flex: 0 0 32px;
    img {
      width: 32px;
      height: 32px;
    }
    &._green {
      img { filter: sepia(1) brightness(1.15) saturate(1.25) hue-rotate(60deg)  }
    }
    &._red {
      img { filter: sepia(1) brightness(1.15) saturate(1.25) hue-rotate(310deg)  }
    }
    &._blue {
      img { filter: sepia(1) brightness(1.15) saturate(1.25) hue-rotate(170deg)  }
    }
  }

  .timer {
    text-align: right;
    margin-left: auto !important;
    color: transparentize($color: $color_fontMain, $amount: 0.5);

    img {
      width: 16px;
      position: relative;
      bottom: 2px;
      margin-left: 6px;
    }

    &._locked {
      color: red;
    }
    // margin-left: auto !important;
  }

</style>
