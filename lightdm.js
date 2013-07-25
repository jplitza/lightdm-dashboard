function username_key(ev) {
  if(ev.keyCode == 9/*TAB*/ || ev.keyCode == 13/*Enter*/) {
    this.disabled = true;
    lightdm.start_authentication(this.value);
  }
  else if(ev.keyCode == 27/*ESC*/) {
    this.value = "";
  }
}
function password_key(ev) {
  if(ev.keyCode == 9/*TAB*/ || ev.keyCode == 13/*Enter*/) {
    lightdm.provide_secret(this.value);
  }
  else if(ev.keyCode == 27/*ESC*/) {
    this.disabled = true;
    lightdm.cancel_authentication();
    this.value = "";
    $('#username').removeAttr('disabled');
  }
}
function show_prompt(text) {
  console.log("show_prompt(" + text + ")");
  $('#password').val("");
  $('#password').removeAttr('disabled');
  $('#password').focus();
}
function timed_login(foo) {}
function authentication_complete() {
  console.log("authentication_complete()");
  if (lightdm.is_authenticated) {
    console.log("authenticated !");
    lightdm.login (lightdm.authentication_user, lightdm.default_session);
  }
  else {
    console.log("not authenticated !");
  }
}
