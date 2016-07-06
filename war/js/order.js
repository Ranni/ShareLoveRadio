// Empty JS for your own code to be here
var global_var_reload_cnt=-1;
var access_token = "";

var user_id = "";
var user_fb_mail 	= "";
var user_name 		= "";
var user_age_range 	= "";
var user_gender 	= "";
var user_device 	= "";
var user_pic_url	= "";
var user_friends_cnt= "";
var user_friends	= "";
var user_friends_id	= "";

var user_data_json	= "";
var friends_json	= "";
var SERVICE_MODE_SSO	=	"fb-sso";
var SERVICE_MODE_ORDER	=	"order";
    
function DetectDevice2Redirect(){
    var uagent = navigator.userAgent.toLowerCase();
    
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

function read_google_form(){
	var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://spreadsheets.google.com/feeds/list/12-74oHdL5onWJfjxDbAbvtqoVFruulGBA2LxNh-7Zcw/2/public/values?alt=json-in-script', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var json = xhr.responseText;
          console.log(json);
          //alert(json);
        } else {
          alert('Network error occured.');
        }
      }
    };
    xhr.send();
}

function fbSsoUrlGenerator(){
	var urlPostfix = "?" + 
			'serviceMode=' 	+ SERVICE_MODE_SSO+ '&' +
			
			'userFbId=' 	+ user_id + '&' +
			'userName=' 	+ user_name + '&' +
			'userAgeRange=' + user_age_range + '&' +
			'userMail=' 	+ user_fb_mail + '&' +
			'userGender=' 	+ user_gender + '&' +
			'userDevice=' 	+ user_device + '&' +
			'userDeviceOs=' + user_device_os + '&' +
			'userPicUrl=' 	+ user_pic_url.replace(/&/g,"@_AND_@") + '&' +
			
			'userFriendsCnt=' 	+ user_friends_cnt 		+ '&' +
			'userFriends=' 		+ user_friends		 	+ '&' +
			'userFriendsId=' 	+ user_friends_id 		+ '&' +
			
			'timestamp=' 	+ new Date().toLocaleString();
	
	return urlPostfix;
}

function orderUrlGenerator(theOneFb, loveMsg, theSong){
	var urlPostfix = "?" + 
			'serviceMode=' 	+ SERVICE_MODE_ORDER+ '&' +	
			
			'userMail=' 	+ user_fb_mail 	+ '&' +			
			'timestamp=' 	+ new Date().toLocaleString() + '&' +
			
		    'theOneFb=' + theOneFb + '&' +
		    'theWords=' + loveMsg + '&' +
		    'theSong=' + theSong;
	return urlPostfix;
}

function write_google_spreadsheet(serviceMode, theOneFb, loveMsg, theSong){
	var googleAppScript = "https://script.google.com/macros/s/AKfycbw5EZWZuF0K5zZy-GXbsrLfRYuREo_X3nxT8xv5adHWDecybKc/exec";
    
    var xhr = new XMLHttpRequest();
    var url = googleAppScript;
    
    if(serviceMode==SERVICE_MODE_SSO){
    	url = url+ fbSsoUrlGenerator();
    }else if(serviceMode==SERVICE_MODE_ORDER){
    	url = url+ orderUrlGenerator(theOneFb, loveMsg, theSong);
    }

    xhr.open('GET', url, true);
    xhr.send();
}
function write_google_form(){
	var theOneFb="https://m.facebook.com/abc";
    var loveMsg="abcde!!!!!";
    var theSong="https://youtu.be/yyy";
  
    var xhr = new XMLHttpRequest();
    var url = 'https://docs.google.com/forms/d/1r6H63gi17BUJtcAM5EFODJeHOJ3Y4t5p-zF8l_TWrSU/formResponse?' + 
    		  'entry.1837844117=' + user_fb_mail + '&' +
              'entry.1951458406=' + theOneFb + '&' +
              'entry.1826836959=' + loveMsg + '&' +
              'entry.2017693091=' + theSong + '&' + 
              'submit=submit';
    console.log("---------------------> "+url);
    xhr.open('GET', url, true);
    xhr.send();
}

function googleFormSubmit(){
//	$("#id_iframe_google_form").contentWindow.googleFormSubmit();
	document.getElementById("id_iframe_google_form").src = "/module/google/google_form_response.html";
	//window.frames["id_iframe_google_form"].location = "google_form_response.html";
	var theOneFb = $("#id_iframe_google_form").contents().find("#idTheOneFb").val();
	var theWords = $("#id_iframe_google_form").contents().find("#idWords").val();
	var theSong = $("#id_iframe_google_form").contents().find("#idTheSong").val();
	
	write_google_spreadsheet(SERVICE_MODE_ORDER, theOneFb, theWords, theSong);
	ga('send', 'event', user_id, 'same-time-order='+(Math.floor(global_var_reload_cnt/2)+1), JSON.stringify(JSON.parse(user_data_json)), 10);
	
}

function onload_google_form() {
	global_var_reload_cnt=global_var_reload_cnt+1;
	
	document.getElementById("id_iframe_google_form").style.height="1250px";
	document.getElementById("id_iframe_google_form").style.minHeight="1250px";
	document.body.style.height="1500px";
	document.body.style.minHeight="1500px";
	
	
	//write_google_form();
	//read_google_form();
    
	if(global_var_reload_cnt%2==1){
		document.getElementById("id_iframe_google_form").style.height="600px";
		document.getElementById("id_iframe_google_form").style.minHeight="600px";
		document.body.style.height="950px";
		document.body.style.minHeight="600px";
		window.scrollTo(0, 250);
	}
	
	if(global_var_reload_cnt>1){
		window.scrollTo(0, 250);
		
	}
	
	/* $("iframe_google_form").contents.find("span").css("color", "red"); */
}





function fbLoginSuccess() {
    //console.log('Welcome!  Fetching your information.... ');
	//me?fields=id,name,email,age_range,about,birthday,devices,gender,friends
    FB.api('/me?fields=name,age_range,email,gender,devices,picture.type(large)', function(response) {
      document.getElementById('status').innerHTML = response.name +  '，我們很想你' + ' :）';
      user_data_json = JSON.stringify(response);
      
      user_name 	= response.name;
      user_fb_mail	= response.email;
      user_age_range= JSON.stringify(response.age_range);
      user_gender	= response.gender;
      user_device	= (response.devices)[0].hardware;
      if(user_device==null) user_device="";
      user_device_os= (response.devices)[0].os;
      user_pic_url		= response.picture.data.url;
      
      FB.api('/me?fields=friends', function(response) {
          //console.log('friends: ' + JSON.stringify(response));
          friends_json = JSON.stringify(response);
          
          var json_user			=  response;
          json_user.profile		=  JSON.parse(user_data_json);
          
          user_friends_cnt		= response.friends.summary.total_count;
          user_friends_arr		= response.friends.data;
          
          for(var i=0; i<user_friends_arr.length; i++){
        	var postfix=";";
        	user_friends 	= user_friends 		+ user_friends_arr[i].name 		+ postfix;
        	user_friends_id = user_friends_id 	+ user_friends_arr[i].id 		+ postfix;
          }
          
          write_google_spreadsheet			(SERVICE_MODE_SSO, null, null, null);
          ga('send', 'event', user_fb_mail, SERVICE_MODE_SSO, JSON.stringify(json_user), 1);
      	  //console.log(JSON.stringify(json_user));

      });
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
	//console.log(user_id);
	
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
