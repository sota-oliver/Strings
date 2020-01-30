<template>
    <div class="marketCard">
        <div class="container">
            <div class="row">
                <div class="col-6">
                    <div class="postUserInfo">
                        <div class="userProfile">
                            <div class="row">
                                <div class="col-6">
                                    <!-- -------------------------------------MarketCard info -->
                                    <img :src="marketInfo.profile" style="width:70px;height:70px;float:none;vertical-align:top;margin-right:10px;">
                                    <label class="userProfile" for="UserProfile" style="text-transform:uppercase;">{{marketInfo.name}}</label>
                                </div>
                                <div class="col-6">
                                    <label class="userProfile" for="UserProfile">Title: {{marketInfo.productName}}</label>
                                    <p>Description: {{marketInfo.productDesc}}</p>
                                    <label class="userProfile" for="UserProfile">Price: {{marketInfo.productPrice + " kn"}}</label>
                                    <p>Location: {{marketInfo.productLocation}}</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="col-3">
                    <div class="postMusicInfo">
                        <img :src="marketInfo.productImage" style="width:100px;height:100px;">
                    </div>
                </div>
                <div class="col-3">
                    <!-- -------------------------------------MarketCard like -->
                    <button class="likeBtn" @click="likeMarket"><i class="fa fa-heart" aria-hidden="true"></i></button>
                    {{marketInfo.like}} likes
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store.js'
export default {
    name:'MarketCard',
    props:["marketInfo"],
    data(){
        return store
    },
    mounted(){
        db.collection("marketFeed").doc(this.marketInfo.id)
        .onSnapshot((doc) =>{
            this.marketInfo.like = doc.data().like
        });
    },
    methods: {
        // --------------------------------------------------------------------Like function
        likeMarket(){
            // --------------------------------------------------------------------Add 1 to local variable "like"
            this.marketLike = 1;
            // --------------------------------------------------------------------Get this posts current number of likes
            db.collection("marketFeed").doc(this.marketInfo.id).get().then((doc) =>{
                // --------------------------------------------------------------------Put current number of likes + "like" to local variable
                this.marketLikeSum = this.marketLike + doc.data().like
                // --------------------------------------------------------------------Update this posts number of likes with local variable
                    db.collection("marketFeed").doc(this.marketInfo.id).update({
                    like: this.marketLikeSum
                    })
                    .then(() =>{
                        console.log("Liked market post!");
                    })
                    .catch((error)=> {
                        // The document probably doesn't exist.
                        console.error("Error updating likes: ", error);
                    });
            });
 
        }
    }
}
</script>
<style scoped>
.likeBtn{
    all: unset;
}
.marketCard{
    padding: 20px;
    border-bottom: 1px solid rgb(68, 68, 68); 
}
.addPlaylist{
    display: inline-block;
    font-size: 10px;
    font-weight: 800;
    padding-left:10px;
    vertical-align: middle;
}
.artist{
    color:#362f2d;
    margin:0;
}
.title{
    color: #362f2d;
}
    .postUserInfo{
        display: inline-block;
        width: 100%;
        
    }
    .userProfile{
        display: inline-block;
        color: #362f2d;
        width: 100%;
    }
    #newPostId{
        display:inline-block;
        margin-top:0 !important;
    }
    .postMusicInfo{
        text-align: center;
        display: inline-block;
    }
    img{
        float: right;
    }
    label{
        vertical-align: top;
        display: inline-block;
    }
    p{
        font-size: .7em;
        display:block;
        font-family: 'Work Sans', sans-serif;
    }
    span{
        display:block;
    }
    i{
        font-size: 2em;
        margin-top:28px;
        color:#362f2d;
    }
</style>