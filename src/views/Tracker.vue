<template>
  <div class="container">
    <!-- <div class="last-refreshed"
      v-if="this.calcLastRefresh(this.lastRefreshed) > 10"
      :class="{'_refresh': true}">Hay un error con el servidor. Ultimo refresco: {{ this.$moment(this.lastRefreshed).format('HH:mm:ss') }}</div> -->
    <!-- <div>{{selectedWorld}} {{filterByMap}} {{matchId}}</div> -->
    <UISelect
      style="margin-bottom: 1rem;" 
      v-model="selectedWorld" 
      :options="optionsWorlds" 
      @input="handleChangeWorld()"
    />

    <UISelect
      style="margin-bottom: 1rem;" 
      v-model="filterByMap" 
      :options="optionsMapTypes" 
      @input="handleChangeMap()"
    />

    <div class="loading-bar">
      <UIToast
        :msgTxt="'Hay un error con el servicio, los datos no serán actualizados'"
        :show="this.calcLastRefresh(this.lastRefreshed) > 10"
        :type="'error'"
      />
      <UILoadingBar :loading="loading"/>
    </div>

    <div class="">
      <UIObjetiveItem 
        v-for="objetive in trackerData"
        :key="objetive.name"
        :name="objetive.name"
        :type="objetive.type"
        :owner="objetive.owner"
        :lastFlipped="objetive.lastFlipped"
        :correction="worldTimeCorrection"
      />
    </div>
  </div>
</template>

<script>
import UISelect from '@/components/UISelect.vue'
import UIObjetiveItem from '@/components/UIObjetiveItem.vue'
import UILoadingBar from '@/components/UILoadingBar.vue'
import UIToast from '@/components/UIToast.vue'
import { setInterval } from 'timers';
import * as objetiveNames from '@/assets/data/objetives-mapnames.json';


export default {
  name: 'tracker',

  components: {
    UISelect,
    UIObjetiveItem,
    UILoadingBar,
    UIToast
  },

  data() {
    return {
      selectedWorld: null,
      filterByMap: 'Center',
      matchId: null,
      optionsWorlds: [],
      optionsMapTypes: [
        {value: 'Center', text: 'Campos Eternos'},
        {value: 'GreenHome', text: 'Mapa Verde'},
        {value: 'BlueHome', text: 'Mapa Azul'},
        {value: 'RedHome', text: 'Mapa Rojo'},
      ],
      trackerData: [],
      lastRefresehdHash: '',
      lastRefreshed: '',
      refreshingMsg: '',
      worldTimeCorrection: 0,
      loading: false
    }
  },
  
  created() {
    this.filterByMap = localStorage.getItem('filterByMap');

    this.setWorlds();
    this.getWorldTimer();

    // sincroniza con la api cada 10 segundos
    setInterval(() => {
      if (this.matchId) {
        this.getTrackerData();
      }
    }, 10000)
  },

  methods: {

    // obtiene la hora y aplica el factor de corrección
    getWorldTimer() {
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const url = 'http://worldtimeapi.org/api/timezone/Etc/UTC'
      const correctionFactor = 1
      fetch(proxy + url)
        .then(resp => resp.json())
        .then(data => {
          this.worldTimeCorrection = -(this.$moment().diff(data.datetime, 'seconds') - correctionFactor)
        });
    },
      
    // maneja el selector de cambio de mundo
    handleChangeWorld() {
      this.setMatchId(this.selectedWorld)
      localStorage.setItem('selectedWorld', this.selectedWorld);
    },

    //maneja el selector de cambio de mapa
    handleChangeMap() {
      localStorage.setItem('filterByMap', this.filterByMap);
      if (this.matchId) {
        this.getTrackerData();
      }
    },

    // obtiene y setea todos los wordls
    setWorlds() {
      this.$http.get('/worlds?ids=all', { enableCache: true })
        .then(worlds => {
          this.optionsWorlds = worlds.map(world => ({
            value: world.id,
            text: world.name
          }));
          this.selectedWorld = localStorage.getItem('selectedWorld');
          this.setMatchId(this.selectedWorld)
        })
        // .catch(error => console.error(error))
    },

    // obtiene y setea el match de WvW a partir del worldId
    setMatchId(worldId) {
      this.$http.get(`/wvw/matches/overview?world=${worldId}`)
        .then(match => {
          // console.log(match.id);
          this.matchId = match.id;
          this.getTrackerData();
        })
    },

    // obtiene la información de nombre y tipo de los objetivos pasados por id
    _getObjectivesInfo(objetivesIds) {
      return new Promise((resolve, reject) => {
        this.$http.get(`/wvw/objectives?ids=${objetivesIds.join()}`, { enableCache: true })
          .then(objectives => {
            const mapObjetivesInfo = objectives.map(objetive => (
              {
                id: objetive.id,
                name: this._getObjetiveName(objetive.name),
                type: objetive.type
              }
            ));
            resolve(mapObjetivesInfo);
          })
          .catch(error => reject(error))
      })
    },

    // obtiene el resultado de scores y time del mapa y el match pasado
    _getMapObjetivesData() {
      return new Promise((resolve, reject) => {
        this.$http.get(`/wvw/matches/${this.matchId}?_=${this.$moment().format('x')}`)
          .then(matches => {

            const dataToHash = btoa(JSON.stringify(matches));

            // comprueba el hash del data obtenido con el de la última actualización disponible
            if (this.lastRefresehdHash !== dataToHash) {
              this.lastRefresehdHash = dataToHash;
              this.lastRefreshed = this.$moment().toISOString()
            } else {
              // console.error('no refrescada');
            }

            // obtiene y mapea los objetivos del mapa seleccionado
            const mapObjetives = matches.maps
              .find(map => map.type === this.filterByMap)
              .objectives
            resolve(mapObjetives);
          })
          .catch(error => reject(error))
      });
    },

    // obtiene los nombres mapeados. De no existir, devuelve el nombre por defecto
    _getObjetiveName(name) {
      const list = objetiveNames.default
      return list[this.filterByMap][name] || name
    },

    getTrackerData() {
      this.loading = true
      this._getMapObjetivesData()
        .then(objetivesData => {
          const objetivesIds = objetivesData.map(mapObjetiveData => mapObjetiveData.id)
          this._getObjectivesInfo(objetivesIds)
            .then(objetivesInfo=> {
              const hashedObjetivesInfo = objetivesInfo.reduce((allObjetives, objetive) => {
                return {...allObjetives, [objetive.id]: objetive};
              }, {});
              const trackerData = objetivesData
                .map(objetive => ({
                    name: hashedObjetivesInfo && hashedObjetivesInfo[objetive.id] 
                      ? hashedObjetivesInfo[objetive.id].name
                      : 'notFound',
                    lastFlipped: objetive.last_flipped,
                    type: hashedObjetivesInfo && hashedObjetivesInfo[objetive.id]
                      ? hashedObjetivesInfo[objetive.id].type
                      : 'notFound',
                    owner: objetive.owner
                  }))
                .filter(objetive => 
                  objetive.type !== 'Spawn'
                  && objetive.type !== 'Mercenary'
                )
              this.trackerData = this._.orderBy(trackerData, o => this.$moment(o.lastFlipped).format('x'), ['desc']);
              this.loading = false
            })
        });
    },

    calcLastRefresh(ISOTimePoint) {
      return this.$moment().diff(ISOTimePoint, 'seconds')
    },
  },

}
</script>

<style lang="scss" scoped>
  @import '~@/styles/settings';

  .container {
    padding: 1rem;
  }

  .last-refreshed {
    color: red;
    &._refresh {
      // animation: refresh 300 forwards;
    }
  }

  .loading-bar {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
  }
  

</style>

