<template>
    <div class="homeAppBackground">
        <div class="row">
            <div class="col-3" style="padding:0;">
                <!-- left nav -->
                <div class="leftNav">
                    <router-link to="/" name="profileLink" aria-hidden="true"><i class="fa fa-square"><div class="leftNavLinks">{{userName}}</div></i></router-link>
                    <div class="leftNavMusic" style="border-bottom:solid 1px black;border-top:solid 1px black;">
                        <button @click="showMusicFeed" name="profileLink" aria-hidden="true" style="background-color:#362f2d;border:none;padding:0;"><i class="fa fa-square"><div class="leftNavLinks">Music feed</div></i></button>
                        <button @click="showPlaylist" name="profileLink" aria-hidden="true" style="background-color:#362f2d;border:none;padding:0;"><i class="fa fa-square"><div class="leftNavLinks">My playlist</div></i></button>
                    </div>
                    <div class="leftNavSocial" style="border-bottom:solid 1px black;">
                        <button @click="showMarketplace" name="profileLink" aria-hidden="true" style="background-color:#362f2d;border:none;padding:0;"><i class="fa fa-square"><div class="leftNavLinks">Marketplace</div></i></button>
                        <button @click="showChat" name="profileLink" aria-hidden="true" style="background-color:#362f2d;border:none;padding:0;"><i class="fa fa-square"><div class="leftNavLinks">Messages</div></i></button>
                        <button @click="showFriends" name="profileLink" aria-hidden="true" style="background-color:#362f2d;border:none;padding:0;"><i class="fa fa-square"><div class="leftNavLinks">Friends</div></i></button>
                        <router-link to="/" name="profileLink" aria-hidden="true"><i class="fa fa-square"><div class="leftNavLinks">Find a band!</div></i></router-link>
                    </div>
                    <router-link to="/" name="profileLink" aria-hidden="true"><i class="fa fa-square"><div class="leftNavLinks">Need help?</div></i></router-link>
                </div>
            </div>
            <div class="col-9"  style="padding:0;">
                <!-- right nav -->
                <div class="rightNav">
                    <div class="playerBackground">
                        <Player/>
                    </div>
                    <ul class="appNav">
                        <li><button @click="showMusicFeed" name="profileLink" aria-hidden="true" style="background-color:#a7a7a7;border:none;padding:0;"><div class="leftNavLinks" style="color:#362f2d;margin:0;">Music feed</div></button></li> |
                        <li><button @click="showMarketplace" name="profileLink" aria-hidden="true" style="background-color:#a7a7a7;border:none;padding:0;"><div class="leftNavLinks" style="color:#362f2d;margin:0;">Market feed</div></button></li> |
                        <li><button @click="showPlaylist" name="profileLink" aria-hidden="true" style="background-color:#a7a7a7;border:none;padding:0;"><div class="leftNavLinks" style="color:#362f2d;margin:0;">My playlist</div></button></li>
                    </ul>
                    <!-- -------------------------------------Chat -->
                    <Chat v-if="chatAuth"/>
                    <!-- -------------------------------------Marketplace -->
                    <Marketplace v-if="marketAuth"/>
                    <form v-if="musicAuth" @submit.prevent="newPost">
                        <div class="newPostForm">
                            <!-- -------------------------------------Add new music post -->
                            <center><button @click="addNewPost" v-if="newPostButton" type="button" id="newPostButton"><i class="fa fa-plus-square" id="newPostId" aria-hidden="true"></i></button></center>
                            <center><div v-if="newPostAuth" class="newInputForm" id="newPostAuth">
                                <i @click="back" class="fa fa-times" aria-hidden="true" id="newPostId"></i>
                                <h2 style="margin-bottom:40px;">Upload a post</h2>
                                <input v-model="newArtist" type="text" placeholder="Artist">
                                <input v-model="newTitle" type="text" placeholder="Title">
                                <input type="file" @change="uploadFile" class="inputBrowse">
                                <button type="submit" class="browseButton">Submit</button>
                                
                            </div></center>
                            <div class="cards" v-if="postAuth">
                                <!-- -------------------------------------List StringsCard -->
                                    <div :key="card.id" v-for="card in filteredCards">
                                        <StringsCard :info="card"/>
                                    </div>
                                </div>
                        </div>
                    </form>
                    <!-- -------------------------------------Friends -->
                    <Friends v-if="friendsAuth"/>
                    <!-- -------------------------------------Playlist -->
                    <Playlist v-if="playlistAuth"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StringsCard from '@/components/StringsCard.vue'
import Friends from '@/components/Friends.vue'
import Playlist from '@/components/Playlist.vue'
import Player from '@/components/Player.vue'
import Chat from '@/components/Chat.vue'
import Marketplace from '@/components/Marketplace.vue'
import store from '@/store.js'

export default {
    name:'HomeApp',
    data (){
        return store
    },
    mounted(){
        // ----------------------------------------------------------------Get user name from database
        db.collection("users").doc(this.userEmail).get().then(doc => {
            if (doc.exists) {
                this.userName = doc.data().userName;
            } else {
                console.log("Cant get user name! Did you register your email with all lowercase letters?");
            }
        }).catch(error => {
            console.log("Error getting user info:", this.error);
        });
        // ----------------------------------------------------------------Get user profile picture from database
        db.collection("users").doc(this.userEmail).collection("profilePicture").doc(this.userEmail)
                .get().then((doc)=>{
                    if (doc.exists) {
                    this.profileImg = doc.data().profilePicture;
                    }
                    else {
                        console.log("You dont have a profile picture! Click 'Settings' to upload one.");
                    }
                })
    },
    computed: {
        // ----------------------------------------------------------------List StringsCard
        filteredCards () {
        return this.cards
        }
    },
    components: {
        StringsCard,
        Player,
        Chat,
        Marketplace,
        Friends,
        Playlist
    },
    methods: {
        // -------------------------------------------------New post (feed)
        newPost () {
            this.newPostAuth = false;
            this.newPostButton = true;
            this.musicAuth = true;
            this.postAuth= true;
            // -------------------------------------------------Add new post (feed)
            db.collection("musicFeed")
                .add({
                    like:0,
                    email: this.userEmail,
                    artist: this.newArtist,
                    title: this.newTitle,
                    posted_at: new Date(),
                    songUrl: this.songUrl,
                    imageUrl: this.profileImg
                })
                .then((docRef) => {
                    console.log("Post added with ID: ", docRef.id);
                    this.postId = docRef.id;
                })
                .catch(function(error) {
                    console.error("Error adding post: ", error);
                });
        },
        // -------------------------------------------------Upload post audio (feed)
        uploadFile(e) {
            let file = e.target.files[0];
            
            var storageRef = firebase.storage().ref('musicFeed/' + file.name)
            
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
  
            }, (error) =>{
                console.log(error);
            }, () =>{
            // -------------------------------------------------Generate then get song url
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=> {
                this.songUrl = downloadURL;
                console.log('Song available at:', downloadURL);
            });
            });           
        },
        // -------------------------------------------------Show Marketplace
        showMarketplace(){
            if(this.marketAuth !== true){
                this.marketAuth = true;
                this.newPostButton = false;
                this.postAuth = false;
                this.chatAuth = false;
                this.musicAuth = false;
                this.friendsAuth = false;
                this.playlistAuth = false; 
            }
        },
        // -------------------------------------------------Show Chat
        showChat(){
            if(this.chatAuth !== true){
                this.chatAuth = true;
                this.musicAuth = false;
                this.newPostAuth = false;
                this.marketAuth = false;
                this.friendsAuth = false;
                this.playlistAuth = false;  
            }
        },
        // -------------------------------------------------Show Music Feed
        showMusicFeed(){
            if(this.musicAuth !== true){
                this.musicAuth = true;
                this.postAuth = true;
                this.chatAuth = false;
                this.newPostAuth = false;
                this.newPostButton = true;
                this.marketAuth = false;
                this.friendsAuth = false;
                this.playlistAuth = false; 
            }
        },
        // -------------------------------------------------Show Add Post
        addNewPost(){
            if(this.newPostAuth !== true){
                this.newPostAuth = true;
                this.newPostButton = false;
                this.postAuth = false;
            }
        },
        // -------------------------------------------------Show Friends
        showFriends(){
            if(this.friendsAuth !== true){
                this.friendsAuth = true;
                this.marketAuth = false;
                this.chatAuth = false;
                this.musicAuth = false;
                this.newPostButton = false;
                this.postAuth = false; 
                this.playlistAuth = false;               
            }
        },
        // -------------------------------------------------Show Playlist
        showPlaylist(){
            if(this.playlistAuth !== true){
                this.playlistAuth = true;
                this.marketAuth = false;
                this.chatAuth = false;
                this.musicAuth = false;
                this.newPostButton = false;
                this.postAuth = false; 
                this.friendsAuth = false;               
            }
        },
        // -------------------------------------------------Back to Music Feed
        back () {
            this.chatAuth= false;
            this.musicAuth= true;
            this.newPostAuth= false;
            this.newPostButton= true;
            this.postAuth= true;
            }
        
    }
}
</script>
<style lang="scss" scoped>
.cards{
    height: 320px;
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
    i{
        display:block;
        padding:10px;
        color:#f5ed94;
        
        .leftNavLinks{
            color:rgb(2, 2, 2);
            -webkit-transition-duration: 0.4s;
            transition-duration: 0.4s;
            text-transform: uppercase;
            font-weight: 800;
            color:#ac9179;
            font-family: 'Work Sans', sans-serif;
        }
    }
    #newPostButton{
        padding: 0;
        border: none;
        background: none;
        i:hover{
            background-color: transparent;
        }
    }
    #newPostId{
        font-size:1.3em;
        padding-top:15px;
        margin-bottom: 20px;
        color:#362f2d;
    }
    #upload{
        opacity: 0;
        position: absolute;
        margin:0;
        width: 50px;
    }
    .inputBrowse{
        background-color: rgb(68, 68, 68);
        margin-right:10px !important;
        margin-left:0 !important;
        display:inline-block !important;
        width:105px;
    }
    .browseButton{
        border: none;
        padding: 3px;
        padding-left: 5px;
        padding-right: 5px;
        color:rgb(167, 167, 167);
        background: rgb(68, 68, 68);
        margin-left:10px;
        display: inline-block;
    }
    .newPostForm{
        
        height: 386px;
        input{
            display:block;
            margin: 20px;
        }
    }
    .leftNav{
        background-color: #362f2d;
        height:580px;
        padding:30px;
    }
    .leftNavLinks{
        display: inline-block;
        margin-left: 10px;
        color:rgb(167, 167, 167);
    }
    .rightNav{
        background-color:#ac9179;
    }
    .playerBackground{
        background-color: black;
        height: 150px;
    }
    .appNav{
        text-align: center;
        margin:0;
        list-style: none;
        background-color:rgb(167, 167, 167);
    }
    li{
        display:inline-block;
        margin:10px;
    }
</style>