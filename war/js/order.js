// Empty JS for your own code to be here
var global_var_reload_cnt=-1;
var access_token = "";
var user_id = "";
var user_data_json= "";
var friends_json= "";
    
function DetectDevice2Redirect(){
    var uagent = navigator.userAgent.toLowerCase();
    console.log(uagent);
    
    //document.getElementById("ios_fb_browser_notice").style="display: none";
    if (uagent.search("iphone") > -1){
		  //window.location.assign("fb://friends");
		if(uagent.search("safari") <= -1){
			//not open in safari|chrome
			document.getElementById("ios_fb_browser_notice").style.display="block";
		}
    }else{
    	
    }
}

function onload_google_form() {
	global_var_reload_cnt=global_var_reload_cnt+1;
	console.log('load google form = '+global_var_reload_cnt);
	
	document.getElementById("id_iframe_google_form").style.height="1200px";
	document.getElementById("id_iframe_google_form").style.minHeight="1200px";
	document.body.style.height="1400px";
	document.body.style.minHeight="1400px";
	window.scrollTo(0, 250);
	
	if(global_var_reload_cnt==1){
		document.getElementById("id_iframe_google_form").style.height="500px";
		document.getElementById("id_iframe_google_form").style.minHeight="500px";
		document.body.style.height="850px";
		document.body.style.minHeight="500px";
		window.scrollTo(0, 250);
		//document.body.min-height="560";
			//$('html,body').animate({scrollTop: document.body.scrollHeight},"fast");
	}
	
	/* $("iframe_google_form").contents.find("span").css("color", "red"); */
}





function fbLoginSuccess() {
    //console.log('Welcome!  Fetching your information.... ');
	//me?fields=id,name,email,age_range,about,birthday,devices,gender,friends
    FB.api('/me?fields=name,age_range,email,gender,devices,picture', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML = response.name +  '，我們很想你' + ' :）';
      user_data_json = JSON.stringify(response);
    });
    
    FB.api('/me?fields=friends', function(response) {
        console.log('friends: ' + JSON.stringify(response));
        friends_json = JSON.stringify(response);
    });
    
    /*FB.api('/me?fields=taggable_friends', function(response) {
        console.log('Successful login for: ' + JSON.stringify(response));
    });*/
  }

function hideFbLoginBtn(bIsHide){
	if(bIsHide){
		document.getElementById('fb_login_button').className="facebook_sso_div_hide";
	}else{
		document.getElementById('fb_login_button').className="facebook_sso_div";
	}
}
function resizeLoveThemeImg(bIsHide){
	if(bIsHide){
		document.getElementById('love_theme_img').className="love_theme_img_s";
	}else{
		document.getElementById('love_theme_img').className="love_theme_img";
	}
}

function hideGoogleForm(bIsHide){
	if(bIsHide){
		document.getElementById('id_iframe_google_form').className="iframe_google_form_hide";
	}else{
		document.getElementById('id_iframe_google_form').className="iframe_google_form";
	}
}
  
<!--  ---------------------------- Facebook SSO init ---------------------------- -->

//This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  //console.log(JSON.stringify(response));
  
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  hideFbLoginBtn(false);
  hideGoogleForm(true);
  document.body.style.minHeight=0;
  //resizeLoveThemeImg(false);
  
  access_token = "";
  user_id = ""
    
  if (response.status === 'connected') {
	  
	hideFbLoginBtn(true);
	hideGoogleForm(false);
	document.body.style.minHeight='1400px';
	//resizeLoveThemeImg(true);
	
	access_token	= response.authResponse.accessToken;
	user_id			= response.authResponse.userID;
	console.log(access_token);
	console.log(user_id);
	
    // Logged into your app and Facebook.
    fbLoginSuccess();
    
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = '朋友都在，一起來玩紙飛機！';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = '還沒登入嗎? 我們在等你';
  }
}

var fbLoginPageCallback = function(response){
	statusChangeCallback(response)
}



//This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function init_fb() {
	FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
	//FB.Event.subscribe('auth.login',fbLoginPageCallback);
}

function fb_login() {
    FB.login( function(response) { statusChangeCallback(response);}, { scope: 'public_profile,email,user_friends' } );
}

window.fbAsyncInit = function() {
	  FB.init({
	    appId      : '1574424686221268',
	    cookie     : true,  // enable cookies to allow the server to access 
	                        // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.2' // use version 2.2
	  });
	
	  // Now that we've initialized the JavaScript SDK, we call 
	  // FB.getLoginStatus().  This function gets the state of the
	  // person visiting this page and can return one of three states to
	  // the callback you provide.  They can be:
	  //
	  // 1. Logged into your app ('connected')
	  // 2. Logged into Facebook, but not your app ('not_authorized')
	  // 3. Not logged into Facebook and can't tell if they are logged into
	  //    your app or not.
	  //
	  // These three cases are handled in the callback function.
	
	  FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	  });

};

//Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/zh_TW/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


<!--  ---------------------------- Facebook SSO init ---------------------------- -->
