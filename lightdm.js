function show_username_field() {
  $('#login_prompt').text('Benutzer:');
  $('#login_field').val('').attr('type', 'text').removeAttr('disabled').focus();
  $('#session option:selected').removeAttr('selected');
  $('#session option[value=' + lightdm.default_session + ']').attr('selected', 'selected');
}
function login_key(ev) {
  if(ev.keyCode == 9/*TAB*/ || ev.keyCode == 13/*Enter*/) {
    if(this.type == "text") {
      this.disabled = true;
      lightdm.start_authentication(this.value);
    }
    else {
      this.disabled = true;
      lightdm.provide_secret(this.value);
    }
  }
  else if(ev.keyCode == 27/*ESC*/) {
    if(this.type == "text")
      this.value = "";
    else {
      lightdm.cancel_authentication();
      show_username_field();
    }
  }
}
function show_prompt(text) {
  $('#login_prompt').text(text);
  $('#login_field').val('').attr('type', 'password').removeAttr('disabled').focus();
  var usersession = null;
  for(var i = 0; i < lightdm.users.length; i++)
    if(lightdm.users[i].name == lightdm.authentication_user)
      usersession = lightdm.users[i].session;
  if(usersession) {
    $('#session option:selected').removeAttr('selected');
    $('#session option[value=' + usersession + ']').attr('selected', 'selected');
  }
}
function show_message(text) {
  $('#login_message').text(text);
  setTimeout("$('#login_message').text('')", 15*1000);
}
function authentication_complete() {
  if (lightdm.is_authenticated) {
    lightdm.login(lightdm.authentication_user, $('#session option:selected').val(), $('#language option:selected').val());
  }
  else {
    show_message('Error logging in!');
    lightdm.cancel_authentication();
    show_username_field();
  }
}
function populate_dropdowns() {
  for(var i = 0; i < lightdm.sessions.length; i++) {
    $('#session').append($('<option>').attr('value', lightdm.sessions[i].key).text(lightdm.sessions[i].name));
    if(lightdm.sessions[i].key == lightdm.default_session)
      $('#session option:last-child').attr('selected', 'selected');
  }
  for(var i = 0; i < lightdm.languages.length; i++) {
    $('#language').append($('<option>').attr('value', lightdm.languages[i].code).text(lightdm.languages[i].name + ' (' + lightdm.languages[i].territory + ')'));
    if(lightdm.languages[i].key == lightdm.default_language)
      $('#language option:last-child').attr('selected', 'selected');
  }
}
