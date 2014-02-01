if(!lightdm) {
  console.log('No LightDM running, disabling functionality');
  // create dummy object
  var lightdm = {
    "sessions": [{"key": "session", "name": "Session"}],
    "languages": [{"code": "de_DE", "language": "Deutsch", "territory": "Deutschland"}],
  }
  $(function() {
    $('#power_dropdown').hide();
    $('#login_form').hide();
  });
}

function show_username_field() {
  lightdm.cancel_authentication();
  $('#login_prompt').text('Benutzername');
  $('#login_field')
    .val('')
    .attr('type', 'text')
    .removeAttr('disabled')
    .focus();
  $('#session').selectpicker('val', lightdm.default_session);
}
function login_advance() {
  var field = $('#login_field').get(0);
  if(field.value == "") {
    $('#login_field').focus();
    return;
  }
  if(field.type == "text") {
    field.disabled = true;
    lightdm.start_authentication(field.value);
  }
  else {
    field.disabled = true;
    lightdm.provide_secret(field.value);
  }
}
function login_key(ev) {
  if(ev.keyCode == 9/*TAB*/ || ev.keyCode == 13/*Enter*/)
    login_advance();
  else if(ev.keyCode == 27/*ESC*/)
    show_username_field();
}
function show_prompt(text) {
  $('#login_prompt').text(text);
  $('#login_field')
    .val('')
    .attr('type', 'password')
    .removeAttr('disabled')
    .focus();
  var usersession = null;
  for(var i = 0; i < lightdm.users.length; i++)
    if(lightdm.users[i].name == lightdm.authentication_user)
      usersession = lightdm.users[i].session;
  if(usersession) {
    $('#session').selectpicker('val', usersession);
  }
}
function show_message(text) {
  $('#login_message').text(text);
  setTimeout("$('#login_message').text('')", 15*1000);
}
function authentication_complete() {
  if (lightdm.is_authenticated) {
    lightdm.login(lightdm.authentication_user, $('#session').val(), $('#language option:selected').val());
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
function populate_panel() {
  var labels = {"shutdown": "Herunterfahren", "restart": "Neustarten"};
  var anything = false;
  for(action in {"shutdown":true, "restart":true}) {
    if(eval("lightdm.can_" + action)) {
      anything = true;
      $('#power_menu').append(
        $('<li>').append($('<a>')
          .append(labels[action])
          .attr('href', '#')
          .attr('role', 'menuitem')
          .attr('onclick', 'lightdm.' + action + '()')
        )
      );
    }
  }
  if(!anything) {
    $('#power_dropdown').hide();
  }
}
