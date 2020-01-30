<template>
    <div class="friendCard" style="text-align:center;">
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4">
                <div style="display:block;">
                    <!-- ----------------------------------------------------------------Friends[friend{data}] -->
                    <p class="title" style="text-align:left;">Email: {{friendInfo.email}}</p>
                    <p class="artist" style="text-align:left;">Name: {{friendInfo.name}}</p>
                </div>
                <div style="display:block;">
                    <!-- ----------------------------------------------------------------Delete friend-->
                    <button @click="deleteFriend" style="all: unset;background-color:#362f2d;padding:5px;color:#ac9179;"><i class="fa fa-times" aria-hidden="true" style="margin-right:5px;"></i>Remove</button>
                </div>
                
            </div>
            <div class="col-4"></div>
        </div>
    </div>
</template>
<script>
import store from '@/store.js'
export default {
    props:["friendInfo"],
    data(){
        return store
    },
    methods:{
        // ----------------------------------------------------------------Delete friend
        deleteFriend(){
            db.collection("users").doc(this.userEmail).collection("friends").doc(this.friendInfo.email).delete().then(function() {
                console.log("Friend removed!");
            }).catch(function(error) {
                console.error("Error removing friend: ", error);
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.friendCard{
    padding: 20px;
    border-bottom: 1px solid rgb(68, 68, 68); 
}
</style>