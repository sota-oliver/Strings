<template>
    <div class="profile">
        <div class="container" v-if="authenticated">
            <div class="row">
                <Navbar/>
            </div>
            <UserProfile/>
        </div>
    </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue'
import UserProfile from '@/components/UserProfile.vue'
import store from '@/store.js'
export default {
    data(){
        return store
    },
    components:{
        Navbar,
        UserProfile
    }
}

</script>