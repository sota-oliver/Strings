<template>
    <div style="text-align:center;">
        <h2 style="margin: 40px 0 20px 0;">My playlist</h2>
        <div class="playlistBox">
            <div class="item" :key="index" v-for="(item,index) in musicPlaylist">
                <div class="row">
                <div class="col-4"></div>
                <div class="col-4" style="padding-left:50px;">
                <p class="title" style="text-align:left;">Title: {{ item.title }}</p>
                <p class="artist" style="text-align:left;">Artist: {{ item.artist }}</p>
                </div>
                <div class="col-4"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store.js'
export default {
    data(){
        return store
    }
}
</script>
<style scoped>
.item{
    border-bottom:#362f2d solid 1px;
    margin: 0 30px 30px 30px;
    padding:10px;
}
.playlistBox{
    height: 288px;
    overflow-y: scroll;
    
}
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #362f2d; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #f5ed94; 
}

</style>