<template>
    <div class="row">
        <form v-if="marketAuth" @submit.prevent="newMarketPost" style="width:100%;">
            <div class="newMarketPostForm">
                <!-- -------------------------------------Add new market post -->
                <center><button @click="addNewMarketPost" v-if="newMarketPostButton" type="button" id="newMarketPostButton"><i class="fa fa-plus-square" id="newMarketPostId" aria-hidden="true"></i></button></center>
                <center><div v-if="newMarketPostAuth" class="newMarketInputForm" id="newMarketPostAuth">
                    <i @click="back" class="fa fa-times" aria-hidden="true" id="newMarketPostId"></i>
                    <h2 style="margin-bottom:20px;">Upload a post</h2>
                    <input v-model="newProductName" type="text" placeholder="Product name">
                    <input v-model="newProductPrice" type="text" placeholder="Price in kunas">
                    <input v-model="newProductAddress" type="text" placeholder="Your location">
                    <input v-model="newProductDesc" type="text" placeholder="Description">
                    <input type="file" @change="uploadMarketFile" class="inputBrowse">
                    <button type="submit" class="browseButton">Submit</button>

                    </div></center>
                    
            </div>
        </form>
        <!-- -------------------------------------List MarketCard -->
        <div class="marketCards" v-if="marketPostAuth">
                        <div :key="marketCard.id" v-for="marketCard in filteredMarketCards">
                            <MarketCard :marketInfo="marketCard"/>
                        </div>
                    </div>
    </div>
</template>
<script>
import MarketCard from '@/components/MarketCard.vue'
import store from '@/store.js'
export default {
    name:'Marketplace',
    data(){
        return store
    },
    computed: {
        // ----------------------------------------------------------------List MarketCard
        filteredMarketCards () {
        return this.marketCards
        }
    },
    components:{
        MarketCard
    },
    methods:{
        // -------------------------------------------------New post (market)
        newMarketPost () {
            this.newMarketPostAuth = false;
            this.newMarketPostButton = true;
            this.marketAuth = true;
            this.marketPostAuth= true;
            db.collection("users").doc(this.userEmail).get().then(doc => {
                if (doc.exists) {
                    this.userName = doc.data().userName;
                    // -------------------------------------------------Add new post (market)
                    db.collection("marketFeed")
                        .add({
                            imageUrl: this.profileImg,
                            like:0,
                            name: this.userEmail,
                            userName: this.userName,
                            productName: this.newProductName,
                            productPrice: this.newProductPrice,
                            productLocation: this.newProductAddress,
                            productDesc: this.newProductDesc,
                            productImage: this.productImageUrl,
                            posted_at: new Date()
                        })
                        .then((docRef) => {
                            console.log("Document written with ID: ", docRef.id);
                            this.postId = docRef.id;
                        })
                        .catch(function(error) {
                            console.error("Error adding document: ", error);
                        });
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(error => {
                console.log("Error getting document:", error);
            });
            
        },
        // -------------------------------------------------Upload post photo (market)
        uploadMarketFile(e) {
            let file = e.target.files[0];
            
            var storageRef = firebase.storage().ref('marketFeed/' + file.name)
            
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
  
            }, (error) =>{
            }, () =>{
                // -------------------------------------------------Generate then get photo url
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=> {
                this.productImageUrl = downloadURL;
                console.log('File available at', downloadURL);
            });
            });           
        },
        addNewMarketPost(){
            if(this.newMarketPostAuth !== true){
                this.newMarketPostAuth = true;
                this.newMarketPostButton = false;
                this.marketPostAuth = false;
            }
        },
        back () {
            this.chatAuth= false;
            this.musicAuth= false;
            this.newMarketPostAuth= false;
            this.newMarketPostButton= true;
            this.marketPostAuth= true;
                this.postAuth = false;
                this.newPostAuth = false;
                this.newPostButton = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.marketCards{
    overflow-y: scroll;
    position: absolute;
    right:0;
    width:100%;
    height:336px;
    margin-top:50px;
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
    }
    #newMarketPostButton{
        padding: 0;
        border: none;
        background: none;
        i:hover{
            background-color: transparent;
        }
    }
    #newMarketPostId{
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
    input{
        display:block;
        margin:20px;
    }
    .inputBrowse{
        background-color: rgb(68, 68, 68);
        margin-right:10px !important;
        margin-left:0 !important;
        display:inline-block;
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
    .newMarketPostForm{
        height: 386px;
        padding-right:15px;
        padding-left:15px;
        display:block;
    }
</style>