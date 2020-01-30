<template>
  <div class="chatApp">
    <div class="messaging">
      <div class="inbox_msg">
        <!-- ----------------------------------------------------------------General lobby -->
        <div class="mesgs" v-if="generalChat">
          <div class="msg_history">
            <div :key="messageGeneral.id" v-for="messageGeneral in messagesGeneral" class="incoming_msg">
              <!-- ----------------------------------------------------------------Bind class, differentiate class(sent) from class(recieved) -->
              <div :class="[messageGeneral.author==authUser.email?'sent_msg':'received_msg']">
                <div class="received_withd_msg">
                  <p>{{messageGeneral.message}}</p>
                  <span class="time_date">{{messageGeneral.author}}</span></div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <form @submit.prevent="saveMessageGeneral" class="input_msg_write">
              <input v-model="messageGeneral" type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn" type="submit"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </form>
          </div>
        </div>
        <!-- ----------------------------------------------------------------Marketplace lobby -->
        <div class="mesgs" v-if="marketplaceChat">
          <div class="msg_history">
            <div :key="messageMarketplace.id" v-for="messageMarketplace in messagesMarketplace" class="incoming_msg">
              <!-- ----------------------------------------------------------------Bind class, differentiate class(sent) from class(recieved) -->
              <div :class="[messageMarketplace.author==authUser.email?'sent_msg':'received_msg']">
                <div class="received_withd_msg">
                  <p>{{messageMarketplace.message}}</p>
                  <span class="time_date">{{messageMarketplace.author}}</span></div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <form @submit.prevent="saveMessageMarketplace" class="input_msg_write">
              <input v-model="messageMarketplace" type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn" type="submit"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </form>
          </div>
        </div>
        <!-- ----------------------------------------------------------------Find a band lobby -->
        <div class="mesgs" v-if="findBandChat">
          <div class="msg_history">
            <div :key="messageBand.id" v-for="messageBand in messagesBand" class="incoming_msg">
              <!-- ----------------------------------------------------------------Bind class, differentiate class(sent) from class(recieved) -->
              <div :class="[messageBand.author==authUser.email?'sent_msg':'received_msg']">
                <div class="received_withd_msg">
                  <p>{{messageBand.message}}</p>
                  <span class="time_date">{{messageBand.author}}</span></div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <form @submit.prevent="saveMessageBand" class="input_msg_write">
              <input v-model="messageBand" type="text" class="write_msg" placeholder="Type a message" />
              <button class="msg_send_btn" type="submit"><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </form>
          </div>
        </div>
        <!-- ----------------------------------------------------------------Chat lobbies -->
        <div class="inbox_people">
          <div class="inbox_chat">
            <!-- ----------------------------------------------------------------Open general lobby -->
            <div class="chat_list" @click="showGeneralChat">
              <div class="chat_people">
                <div class="chat_ib">
                  <div class="inboxIcon"><i class="fa fa-globe" aria-hidden="true"></i></div>
                  <h5>General Chat</h5>
                  <p>Test, which is a new approach to have all solutions</p>
                </div>
              </div>
            </div>
            <!-- ----------------------------------------------------------------Open market lobby -->
            <div class="chat_list" @click="showMarketplaceChat">
              <div class="chat_people">
                <div class="chat_ib">
                  <div class="inboxIcon"><i class="fa fa-truck" aria-hidden="true"></i></div>
                  <h5>Markeplace Chat</h5>
                  <p>Test, which is a new approach to have all solutions</p>
                </div>
              </div>
            </div>
            <!-- ----------------------------------------------------------------Open find a band lobby -->
            <div class="chat_list" @click="showBandChat">
              <div class="chat_people">
                <div class="chat_ib">
                  <div class="inboxIcon"><i class="fa fa-music" aria-hidden="true"></i></div>
                  <h5>Band Chat</h5>
                  <p>Test, which is a new approach to have all solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store.js'
export default {
    name: 'Chat',
    data () {
        return store
    },
    methods: {
        // ---------------------------------------------------------------- Show general lobby
        showGeneralChat(){
          this.generalChat = true,
          this.marketplaceChat = false,
          this.findBandChat = false;
        },
        // ---------------------------------------------------------------- Show market lobby
        showMarketplaceChat(){
          this.generalChat = false,
          this.marketplaceChat = true,
          this.findBandChat = false;
        },
        // ---------------------------------------------------------------- Show find a band lobby
        showBandChat(){
          this.generalChat = false,
          this.marketplaceChat = false,
          this.findBandChat = true;
        },
        // ---------------------------------------------------------------- Auto-scroll to bottom on new message
        scrollToBottom(){
          let box = document.querySelector('.msg_history');
          box.scrollTop=box.scrollHeight;
        },
        // ---------------------------------------------------------------- Save message to collection(chat)->document(   GENERAL   )->collection(messages)->data(message,author)
        saveMessageGeneral() {
                db.collection('chat').doc("general").collection("messages").add({
                    message: this.messageGeneral,
                    author: this.authUser.email,
                    createdAt: new Date()
                }).then(()=>{
                  this.scrollToBottom();
                })
                this.messageGeneral=null;
        },
        // ---------------------------------------------------------------- Save message to collection(chat)->document(   MARKETPLACE   )->collection(messages)->data(message,author)
        saveMessageMarketplace() {
                //save to firebase
                db.collection('chat').doc("marketplace").collection("messages").add({
                    message: this.messageMarketplace,
                    author: this.authUser.email,
                    createdAt: new Date()
                }).then(()=>{
                  this.scrollToBottom();
                })
                

                this.messageMarketplace=null;
        },
        // ---------------------------------------------------------------- Save message to collection(chat)->document(   BAND   )->collection(messages)->data(message,author)
        saveMessageBand() {
                //save to firebase
                db.collection('chat').doc("band").collection("messages").add({
                    message: this.messageBand,
                    author: this.authUser.email,
                    createdAt: new Date()
                }).then(()=>{
                  this.scrollToBottom();
                })
                

                this.messageBand=null;
        },
        // ---------------------------------------------------------------- Get     GENERAL     messages realtime
        fetchMessagesGeneral(){
            db.collection('chat').doc("general").collection("messages").orderBy('createdAt').onSnapshot((querySnapshot)=>{
                let allMessages=[];
                querySnapshot.forEach(doc=>{
                    allMessages.push(doc.data())
                })
                this.messagesGeneral=allMessages;

                setTimeout(()=>{
                  this.scrollToBottom();
                },1000);
            })
        },
        // ---------------------------------------------------------------- Get     MARKETPLACE     messages realtime
        fetchMessagesMarketplace(){
            db.collection('chat').doc("marketplace").collection("messages").orderBy('createdAt').onSnapshot((querySnapshot)=>{
                let allMessages=[];
                querySnapshot.forEach(doc=>{
                    allMessages.push(doc.data())
                })
                this.messagesMarketplace=allMessages;

                setTimeout(()=>{
                  this.scrollToBottom();
                },1000);
            })
        },
        // ---------------------------------------------------------------- Get     BAND     messages realtime
        fetchMessagesBand(){
            db.collection('chat').doc("band").collection("messages").orderBy('createdAt').onSnapshot((querySnapshot)=>{
                let allMessages=[];
                querySnapshot.forEach(doc=>{
                    allMessages.push(doc.data())
                })
                this.messagesBand=allMessages;

                setTimeout(()=>{
                  this.scrollToBottom();
                },1000);
            })
        }
    },

    created(){
        // ---------------------------------------------------------------- Make this user "authUser" so the classes can differentiate themselves
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.authUser=user;
            }else{
                this.authUser={}
            }
        })

        this.fetchMessagesGeneral();
        this.fetchMessagesMarketplace();
        this.fetchMessagesBand();

    },

}
</script>
<style scoped>
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
.container{max-width:1170px; margin:auto;}
img{ max-width:100%;}
.inbox_people {
  background:#ebebeb;
  float: left;
  overflow: hidden;
  width: 40%;
}
.inboxIcon{
  font-size:30px;
  display: inline-block;
  color:#f5ed94
}
.inbox_msg {
  clear: both;
  overflow: hidden;
  font-family: 'Work Sans', sans-serif;
}
.top_spac{ margin: 20px 0 0;}


.recent_heading {float: left; width:40%;}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
}
.srch_bar .search-bar{
    background-color: rgb(167, 167, 167);
}

.headind_srch{ padding:10px 29px 10px 20px; overflow:hidden; background-color: rgb(68, 68, 68);}

.recent_heading h4 {
  color:rgb(2, 2, 2);
  font-size: 21px;
  margin: auto;
}
.srch_bar input{ border:1px solid #cdcdcd; border-width:0 0 1px 0; width:80%; padding:2px 0 4px 6px; background:none;}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon { margin: 0 0 0 -27px;}

.chat_ib h5{ font-size:15px; vertical-align: middle; color:#ac9179; margin:0 0 8px 10px; display: inline-block;}
.chat_ib h5 span{ font-size:13px; float:right;}
.chat_ib p{ font-size:14px; color: #a7a7a7; margin:auto}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people{ overflow:hidden; clear:both;}
.chat_list {
  border-bottom: 2px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 22px;
  background-color: #362f2d;
}
.inbox_chat { height: 386px; }
.active_chat{ background:#ebebeb;}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  left:0;
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: bottom;
  width: 55%;
 }
 .received_withd_msg p {
  background:#a7a7a7 none repeat scroll 0 0;
  border-radius: 3px;
  color: rgb(2, 2, 2);
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #362f2d;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
  text-align: right;
}
.mesgs {
  float: left;
  padding: 0 0 0 25px;
  width: 60%;
  background:#ac9179;
  
}

 .sent_msg p {
  background: #362f2d none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0; color:#fff;
  padding: 5px 10px 5px 12px;
  width:100%;
  float: right;
  text-align: right;
}
.outgoing_msg{ overflow:hidden; margin:26px 0 26px;}
.sent_msg {
  margin-right: 15px;
  float: right;
  width: 55%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {border-top: 1px solid #c4c4c4;position: relative;margin-bottom:5px;margin-right:15px;}
.msg_send_btn {
  background: rgb(68, 68, 68) none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: rgb(167, 167, 167);
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging { padding: 0 0 50px 0; height: 350px;}
.msg_history {
  height: 332px;
  overflow-y: auto;
}
.incoming_msg:first-child{
  margin-top:30px;
}
</style>