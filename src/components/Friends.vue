<template>
    <div>
        <center><h2 style="margin-top:40px;margin-bottom:20px;">Friends</h2></center>
        <center><div class="friends" style="height:288px;">
            <!-- ----------------------------------------------------------------List FriendCard components -->
            <div :key="friend.id" v-for="friend in filteredFriends">
                <FriendCard :friendInfo="friend"/>
            </div>
        </div></center>
    </div>
</template>
<script>
import FriendCard from '@/components/FriendCard.vue'
import store from '@/store.js'
export default {
    data(){
        return store
    },
    computed: {
        filteredFriends () {
        return this.friends
        }
    },
    components:{
        FriendCard
    },
    
}
</script>
<style lang="scss" scoped>
.friends{
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