<template>
  <div class="container" v-if="authenticated">
    <div class="row">
        <Navbar/>
    </div>
    <HomeApp/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import HomeApp from '@/components/HomeApp.vue'
import store from '@/store.js'

export default {
  data () {
    return store;
  },
  name: 'home',
  components: {
    Navbar,
    HomeApp
  }
}
</script>

<style lang="scss">

.card-body {
  padding: 0px;
}
.container{
  margin-top:5px;
}
img:hover {
  cursor: pointer;
}
</style>