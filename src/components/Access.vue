<template>
    <div>
        <div class="container">
          <div class="row">
            <div class="col-4">
              <img src="@/assets/1.png" class="accessLogoImg">
            </div>
            <div class="login col-4">
                <!-- -----------------------------------------------Buttoni za login/signup -->
              <form id="accessForm" class="accessForm">
                <h2 id="accessHeader" style="color:#716053; ">Access page</h2>
                <div class="buttonAccess">
                    <button type="reset" id="loginButton" class="buttonSubmit" @click="showLogin">Login</button>
                </div>
                <div class="buttonAccess">
                    <button type="reset" id="signupButton" class="buttonSubmit" @click="showSignup">Signup</button>
                </div>
                <!-- ----------------------------------------------------------------Signup form -->
                <form id="Signup" @submit.prevent="signup" style="display:none;">
                  <div class="form-group">
                        <label for="userName">Name</label>
                        <input v-model="name" type="text" class="form-control" aria-describedby="emailHelp" placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label for="emailField">Email address</label>
                        <input v-model="email" type="email" class="form-control" id="emailFieldSignup" aria-describedby="emailHelp" placeholder="Enter email">
                    </div>
                    <div class="form-group">
                        <label for="passwordField">Password</label>
                        <input v-model="password" type="password" class="form-control" id="passwordFieldSignup" placeholder="Password">
                    </div>
                    <div class="form-group">
                        <label for="confirmPasswordField">Confirm Password</label>
                        <input v-model="passwordConfirmation" type="password" class="form-control" id="confirmPasswordField" placeholder="Confirm password">
                    </div>
                    <button type="submit" class="buttonSubmit" style="margin-right: 10px;">Submit</button>
                    <button type="reset" class="buttonSubmit" @click="back" style="margin-left: 10px;">Back</button>
                </form>
                <!-- ----------------------------------------------------------------Login form -->
                <form id="Login" @submit.prevent="login" style="display:none;">
                  <div class="form-group">
                    <label for="emailFieldLogin">Email address</label>
                    <input v-model="email" type="email" class="form-control" id="emailFieldLogin" aria-describedby="emailHelp" placeholder="Enter email">
                  </div>
                  <div class="form-group">
                    <label for="passwordFieldLogin">Password</label>
                    <input v-model="password" type="password" class="form-control" id="passwordFieldLogin" placeholder="Password">
                  </div>
                  <button type="submit" style="margin-right: 10px;" class="buttonSubmit">Submit</button>
                  <button type="reset" class="buttonSubmit" style="margin-left: 10px;" @click="back">Back</button>
                </form>
              </form>
            </div>
            <div class="col-4">
            </div>
          </div>
        </div>
    </div>
</template>
<script>


export default {
  name:'Access',
    data () {
    return {
      email: '',
      name: '',
      password: '',
      passwordConfirmation: '',
    }
  },
    methods: {
    // ----------------------------------------------------------------Access back to main
    back : function (event){
      document.getElementById("accessHeader").style.display = "inline-block";
      document.getElementById("accessForm").style.paddingTop = "50px";
        document.getElementById("Login").style.display = "none";
        document.getElementById("Signup").style.display = "none";
        document.getElementById("loginButton").style.display = "inline-block";
        document.getElementById("signupButton").style.display = "inline-block";
    },
    // ----------------------------------------------------------------Access show login
    showLogin : function (event) {
        document.getElementById("Login").style.display = "inline-block";
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("signupButton").style.display = "none";
        document.getElementById("accessHeader").style.display = "none";
    },
    // ----------------------------------------------------------------Access show signup
    showSignup : function (event) {
        document.getElementById("Signup").style.display = "inline-block";
        document.getElementById("accessForm").style.paddingTop = "10px";
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("signupButton").style.display = "none";
        document.getElementById("accessHeader").style.display = "none";
    },
    // ----------------------------------------------------------------Signup user
    signup () {
      if(this.password.toString().length > 5){
        if(this.password == this.passwordConfirmation){
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
            console.log(error)
          });
          // ----------------------------------------------------------------Create collection(users)->document(id(email)->data(input))
          db.collection('users').doc(this.email).set({
            userName: this.name,
            userMail: this.email,
            userPassword: this.password,
            postedAt: new Date(),
          })
          .then(function(docRef) {
              console.log("User added with ID: ", docRef.id);
              
          })
          .catch(function(error) {
              console.error("Error adding user: ", error);
          });
        }else{
          window.alert("Passwords do not match!");
        }
      
      }else{
        window.alert("Password must be at least 6 characters!");
      }
    },
    // ----------------------------------------------------------------Login user
    login () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
        console.log(error);
      });
    }
  }
}
</script>
<style lang="scss" scope>
body{
  background-color: (#716053);
  background-size: cover;
  font-family: 'Work Sans', sans-serif;
}
.accessForm{
    width: 100%;
    height: 100%;
    background-color: #362f2d; 
    padding:50px;
    text-align: center;
  }
  .buttonAccess{
    width: 50%;
    display:inline-block;
    
  }
  .buttonSubmit{
    width:80px;
    background-color: #716053;
    color: #362f2d;
    border:#f5ed94 solid 2px;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  margin-top:50px;
  }
  .form-group{
    text-align: left;
  }
  label{
    color: #716053;
  }
  .accessLogoImg{
    width: 48%;
    max-width: 100%;
    margin-right: 131px;
    height: auto;
    float:right;
    }
</style>