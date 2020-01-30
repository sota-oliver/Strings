<template>
    <div class="stringsCard">
        <div class="container">
            <div class="row">
                <div class="col-7" style="border-right:#716053 solid 1px;">
                    <div class="postUserInfo">
                        <img :src="info.profile" style="width:70px;height:70px;float:none;vertical-align:top;margin-right:10px;">
                        <div class="userProfile">
                        <label class="userProfile" for="UserProfile"> {{info.email}}</label>
                        <p>Lorem ipsum dolor sit amet, consectetur </p>
                        </div>
                        <i @click="addFriend" class="fa fa-address-book" id="newPostId" aria-hidden="true" style="padding:5px;text-align:center;"><p class="addPlaylist" style="display:block;padding:0;padding:5px;">Add friend </p></i>
                        
                    </div>
                </div>
                <div class="col-2">
                    <div class="postMusicInfo">
                        <h4 class="artist">{{info.artist}}</h4>
                        <label class="title">{{info.title}}</label>
                    </div>
                </div>
                <div class="col-3">
                    <div style="display:block;">
                    <!-- -------------------------------------Add song from post to playlist -->
                    <i class="fa fa-plus-square" id="newPostId" aria-hidden="true" @click="addSong" style="margin-left:2px;"></i>
                    <p class="addPlaylist">Add to playlist </p>
                    </div>
                    <!-- -------------------------------------Add 1 to this posts likes -->
                    <i class="fa fa-heart" id="newPostId" aria-hidden="true" @click="likeFeed"></i>
                    <p class="addPlaylist" style="width:40%;">{{info.like}} likes</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store.js'
export default {
    name:'StringsCard',
    props: [ "info" ],
    data(){
        return store
    },
    mounted(){
        // --------------------------------------------------------------------Get number of likes realtime
        db.collection("musicFeed").doc(this.info.id)
        .onSnapshot((doc) =>{
            this.info.like = doc.data().like
        });
    },
    methods :{
        // --------------------------------------------------------------------Add song function
        addSong(){
            // --------------------------------------------------------------------Get this posts data
            db.collection("musicFeed").doc(this.info.id).get().then(doc => {
                if (doc.exists) {
                    // --------------------------------------------------------------------Put data to local variables
                    this.songUrl = doc.data().songUrl;
                    this.newTitle = doc.data().title;
                    this.newArtist = doc.data().artist;
                    // --------------------------------------------------------------------Put data from local variables to database
                    db.collection("users").doc(this.userEmail).collection("playlist")
                        .add({
                            id:'',
                            songUrl: this.songUrl ,
                            title: this.newTitle,
                            artist: this.newArtist, 
                            posted_at: new Date(), 
                        })
                        .then((docRef) => {
                            console.log("Song URL: ", this.songUrl);
                            console.log("Song added with ID: ", docRef.id);
                        })
                        .catch((error) => {
                            console.error("Error adding song to playlist: ", error);
                        });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such post!");
                }
            }).catch(error => {
                console.log("Error getting post:", this.error);
            });
            
        },
        // --------------------------------------------------------------------Add friend function
        addFriend(){
            // --------------------------------------------------------------------Get this posts data
            db.collection("musicFeed").doc(this.info.id).get().then(doc => {
                if (doc.exists) {
                    // --------------------------------------------------------------------Put data to local variables
                    this.addFriendMail = doc.data().email;
                    // --------------------------------------------------------------------Get data from user that posted this post
                    db.collection("users").doc(this.addFriendMail).get().then((doc) =>{
                        if (doc.exists) {
                            // --------------------------------------------------------------------Put data to local variables
                            this.addFriendName = doc.data().userName;
                            // --------------------------------------------------------------------Add friend data to your collection
                            db.collection("users").doc(this.userEmail).collection("friends").doc(this.addFriendMail)
                                .set({
                                    added_at: new Date(),
                                    email: this.addFriendMail,
                                    name: this.addFriendName
                                })
                                .then(()=> {
                                    console.log("Friend added: ", this.addFriendMail);
                                })
                                .catch(error => {
                                    console.error("Error adding friend: ", error);
                                });
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such friend exists!");
                        }
                    }).catch((error)=>{
                        console.log("Error getting friend:", error);
                    });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such friend email!");
                }
            }).catch(error => {
                console.log("Error getting friend document:", this.error);
            });
        },
        // --------------------------------------------------------------------Like function
        likeFeed(){
            // --------------------------------------------------------------------Add 1 to local variable "like"
            this.feedLike = 1;
            // --------------------------------------------------------------------Get this posts current number of likes
            db.collection("musicFeed").doc(this.info.id).get().then((doc) =>{
                // --------------------------------------------------------------------Put current number of likes + "like" to local variable
                this.feedLikeSum = this.feedLike + doc.data().like
                // --------------------------------------------------------------------Update this posts number of likes with local variable
                    db.collection("musicFeed").doc(this.info.id).update({
                    like: this.feedLikeSum
                    })
                    .then(() =>{
                        console.log("Liked a music post!");
                    })
                    .catch((error)=> {
                        console.error("Error adding like: ", error);
                    });
            });
 
        }
    }
}
</script>
<style lang="scss" scoped>
.stringsCard{
    padding-top:20px;
    padding-bottom:20px;
    margin-left:20px;
    margin-right:20px;
    border-bottom: 1px solid #716053; 
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
        
    }
    .userProfile{
        display: inline-block;
        color: #362f2d;
    }
    #newPostId{
        display:inline-block;
        margin-top:0 !important;
    }
    .postMusicInfo{
        width:100%;
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
        max-width: 150px;
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