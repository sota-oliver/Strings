<template>
  <div id="app">
        <Access v-if="!authenticated"/>


        <div class="container">

        <router-view/>

        </div>
  </div>
</template>

<script type="text/javascript">
import store from '@/store.js'
import Access from '@/components/Access.vue'

export default {
  components: {
    Access
  },
  data () {
    return store;
  },
    mounted(){
      firebase.auth().onAuthStateChanged((user) =>{
      if (user) {
        this.userEmail = user.email;
        this.userName = user.name;
        this.authenticated = true;

        console.log(`Authenticated: ${user.email}`)
        
        if (this.$route.name !== 'home')
          this.$router.push({name: 'home'})
      }
      else{ 
        this.authenticated = false
        console.log('Logged out')
      }
    });
     db.collection("musicFeed").orderBy("posted_at")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data()
          if (change.type !== "added") return
            const card = {id: change.doc.id, profile: data.imageUrl, email: data.email, title: data.title, artist: data.artist, url: data.songUrl, like: data.like}
            this.cards.unshift(card)
        });
      });
      db.collection("marketFeed").orderBy("posted_at")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const data = change.doc.data()
          if (change.type !== "added") return
            const marketCard = {id: change.doc.id, profile: data.imageUrl, name:data.userName, like: data.like, productName: data.productName, productPrice: data.productPrice, productLocation: data.productLocation, productDesc: data.productDesc, productImage: data.productImage}
            this.marketCards.unshift(marketCard)
        });
      });
      firebase.auth().onAuthStateChanged((user) =>{
      if (user) {
        this.userEmail = user.email;
        db.collection("users").doc(this.userEmail).collection("friends").orderBy("added_at")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            if (change.type === "removed") {
              this.friends.pop(friend)
                console.log("Removed friend: ", change.doc.data().name);
            }
            if (change.type !== "added") return
              const friend = {id: change.doc.id, name:data.name, email:data.email}
              this.friends.unshift(friend)
          });
        });
      }
    });
      firebase.auth().onAuthStateChanged((user) =>{
      if (user) {
        this.userEmail = user.email;
        db.collection("users").doc(this.userEmail).collection("playlist").orderBy("posted_at")
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            const data = change.doc.data()
            if (change.type !== "added") return
              this.musicPlaylist.unshift()
          });
        });
      }
    });
  } 
}
</script>

<style lang="scss">
  .login{
	  margin-top: 10em;
  }
  a{
    color: inherit; 
    text-decoration: inherit; 
  }
  a:hover{
    color: inherit; 
    text-decoration: inherit; 
  }
</style>
