<template>
    <div>
        <div class="row">
            <div class="profileBody">
                <center><img :src="profileImg" class="profilePicture"></center>
                <center><input type="file" @change="uploadFile" class="hideInput"></center>
                <label for="hideInput">Upload photo</label>
                <h1>{{userName}}</h1>
                <h2>{{userEmail}}</h2>
                <button class="button" @click="changePassword">Change password</button>
                <button class="button" @click="deleteAccount">Delete account</button>
                <p id="passwordSent">Password reset link sent</p>
                <p id="accDeleted">Account deleted</p>
            </div>
        </div>
    </div>
</template>
<script>
import store from '@/store.js'
export default {
    data(){
        return store
    },
    mounted(){
        // -----------------------------------------------------------------Get profile picture
        db.collection("users").doc(this.userEmail).collection("profilePicture").doc(this.userEmail).get().then(doc => {
                if (doc.exists) {
                    this.profileImg = doc.data().profilePicture;
                } else {
                    console.log("No profile picture, please upload");
                }
            }).catch(error => {
                console.log("Error getting document:", this.error);
            });
    },
    methods: {
        // -----------------------------------------------------------------Delete account
        deleteAccount(){
            firebase.auth().currentUser.delete().then(function() {
            // User deleted.
            console.log("Account deleted");
            document.getElementById("accDeleted").style.display = "block";
            }).catch(function(error) {
            // An error happened.
            });
        },
        // -----------------------------------------------------------------Change account password
        changePassword(){
            firebase.auth().sendPasswordResetEmail(this.userEmail).then(function() {
            console.log("Password reset link sent");
            document.getElementById("passwordSent").style.display = "block";
            }).catch(function(error) {
            });
        },
        // -----------------------------------------------------------------Upload profile photo function (check HomeApp.vue "uploadFile(e)")
        uploadFile(e) {
                        
            let file = e.target.files[0];
            
            var storageRef = firebase.storage().ref('profilePictures/' + file.name)
            
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
  
            }, (error) =>{
            }, () =>{
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=> {
                this.profileImg = downloadURL;
                console.log('File available at', downloadURL);
                db.collection("users").doc(this.userEmail).collection("profilePicture").doc(this.userEmail)
                .set({
                    posted_at: new Date(),
                    profilePicture: this.profileImg
                })
                .then((docRef) => {
                    console.log("Profile picture added: ", docRef.profilePicture);
                })
                .catch(function(error) {
                    console.error("Error adding profile picture: ", error);
                }); 
            });
            });    
                  
        }
    }
}
</script>
<style lang="scss" scoped>
#passwordSent{
    display:none;
}
#accDeleted{
    display:none;
}
.button{
    width:180px;
    padding:5px;
    margin:5px;
    border: none;
    background-color: #ac9179;
    color:#362f2d;
}
    .profileBody{
        background-color: #362f2d;
        width:100%;
        height:580px;
        text-align: center;
        font-family: 'Work Sans', sans-serif;
        color:#f5ed94;
        h1{
            text-transform: uppercase;
            font-weight: 600;
        }
        label{
            background-color: #ac9179;
            color: #362f2d;
            font-size:18px;
            padding:3px;
            margin-bottom:30px;
        }
    }
    .inputBrowse{
        background-color: rgb(68, 68, 68);
        display:block;
        width:105px;
    }
    .hideInput{
        opacity: 0;
        position: absolute;
        left:400px;
        width:200px;
    }
    .profilePicture{
        margin: 30px 0 10px 0;
        width:250px;
        height:250px;
        display:block;
        text-align: center;
    }
</style>