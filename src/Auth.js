import React, { Component } from 'react';
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyAIhxx_JRRn-U9UxzOiBTVuK3UIBK6jP44",
    authDomain: "uservey-a6ab3.firebaseapp.com",
    databaseURL: "https://uservey-a6ab3.firebaseio.com",
    projectId: "uservey-a6ab3",
    storageBucket: "uservey-a6ab3.appspot.com",
    messagingSenderId: "202555451002"
  };
  firebase.initializeApp(config);

class Auth extends Component{
  constructor(props){
    super(props);
    this.state = {};

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
    this.loginSuccess=this.loginSuccess.bind(this);
  }

  loginSuccess(){
    document.getElementById('logout').classList.remove('hide');
    document.getElementById('login').classList.add('hide');
    document.getElementById('signup').classList.add('hide');
    document.getElementById('google').classList.add('hide');
    this.setState({err : 'Login succes'});
  }
  google(){
    var provider = new firebase.auth.GoogleAuthProvider();
    var promise = firebase.auth().signInWithPopup(provider);
    promise.then( result => {
     var user = result.user;
     console.log(result);
     firebase.database().ref('users/'+user.uid).set({
       email: user.email,
       name: user.displayName
     });
     this.loginSuccess();
   });
   promise.catch( e => {
     var err = e.message;
     this.setState({err});
   });
  }
  logout(){
    firebase.auth().signOut();
    document.getElementById('logout').classList.add('hide');
    document.getElementById('login').classList.remove('hide');
    document.getElementById('signup').classList.remove('hide');
    document.getElementById('google').classList.remove('hide');
    this.setState({err : 'Logout succes'});
  }

  login(event){
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const auth =  firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email,password);
    promise.then(user => {
      this.loginSuccess();
    });
    promise.catch( e => {
      var err = e.message;
      this.setState({err});
    });
  }
  signup(event){
      const email = this.refs.email.value;
      const password = this.refs.password.value;

      const auth =  firebase.auth();
      const promise = auth.createUserWithEmailAndPassword(email,password);

      promise
      .then(user =>{
        var err = 'Welcome '+ user.email;
        firebase.database()
        .ref('users/'+user.uid)
        .set({ email:user.email });
        this.setState({err});
      });

      promise
      .catch( e => {
        var err = e.message;
        this.setState({err});
      });
    }

  render(){
    return(
      <div>
        <input type="email" name="email" ref="email" id="email" placeholder="Enter Your Email "/><br/>
        <input type="password" name="password" ref="password" id="password" placeholder="Enter Your Password "/><br/>
        <p>{this.state.err}</p>
        <button onClick={this.login} id="login">Log In</button>
        <button onClick={this.signup} id="signup">Sign Up</button>
        <button onClick={this.logout} id="logout" className="hide">Log Out</button><br/>
        <button onClick={this.google} id="google" >Sign In With Google</button>
      </div>
    )
  }
}

export default Auth;
