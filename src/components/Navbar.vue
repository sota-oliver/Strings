<template>
    <div class="container" style="margin:0px;">
        <div class="row">
            <div class="col-3" style="height:90px;">
                    <div class="logoLeft">
                    <router-link to="/">
                    <img src="@/assets/1.png" class="logoImg">
                    </router-link>
                    </div>
            </div>
            <div class="col-9" style="height:50px;">
                <div class="topNav">
                    <router-link class="button" to="/profile">Settings</router-link>
                    <!-- ------------------------------------------------------------------Logout-->
                    <button class="button" @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'TopNavBar',
    methods: {
        // -----------------------------------------------------------------Logout
        logout(){
            firebase.auth().signOut();
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    padding:0;
}
    h1{
        display:inline-block;
        font-size: 1.2em;
    }
    .topNav{
        bottom: 0;
        text-align: right;
        height: 100%;
    }
    .button{
        display:inline-block;
        width:10%;
        margin-top:52px;
        background-color: #362f2d;
        margin-left:15px;
        text-align: center;
        line-height: 1.6;
        padding: 5px;
        margin-bottom:10px;
        font-size:.8em;
        border: none;
        color: #ac9179;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
    }
    .logoImg{
        width: 70%;
  max-width: 100%;
  height: auto;
    }
    .logoLeft{
        text-align: center;
        margin-left:15px;
        padding:0;
    }
    .logoName{
        font-family: 'Sonsie One', cursive;
        color:rgb(2, 2, 2);
        font-size: 2em;
        display:inline-block;
        margin:0;
        padding:0;
        position: absolute;
        bottom:0;
        left: 45px;
    }
</style>