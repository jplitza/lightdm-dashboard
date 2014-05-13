function LightDMModule() {
    if(!window.lightdm) {
        console.debug('No LightDM running, disabling module');
        return false;
    }
    this.loadStylesheet();

    $('#panel').append(this.generateLoginForm());
    this.login_field.focus();

    var power_menu = this.generatePowerMenu();
    if(power_menu)
        $('#panel').append(power_menu);

    // register global callback functions for LightDM
    window.show_prompt = $.proxy(this.showPrompt, this);
    window.show_message = $.proxy(this.showMessage, this);
    window.authentication_complete = $.proxy(this.authenticationComplete, this);

    // set fixed height for body
    // otherwise lightdm-webkit-greeter extends the window indefinetly
    console.debug(window.screen.height)
    $('html').css('height', window.screen.height);
    $('html').css('position', 'absolute');
    console.debug($('html').css('height'))

    // load bootstrap-select
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select.min.js', $.proxy(function() {
        this.session_field.attr('data-width', '250').selectpicker();
        this.language_field.attr('data-width', '250').selectpicker();
    }, this));
}

LightDMModule.prototype = Object.create(BaseModule.prototype);
LightDMModule.prototype.constructor = LightDMModule;
LightDMModule.prototype.login_form = null;
LightDMModule.prototype.generateLoginForm = function() {
    var login_form = $('<div>')
        .addClass('navbar-form navbar-left login_form')
        .attr('role', 'form');

    this.login_prompt = $('<div>')
        .addClass('form-group')
        .attr('id', 'login_prompt')
        .text('Benutzername:');

    this.login_field = $('<input>')
        .addClass('form-control input-sm')
        .attr('type', 'text')
        .on('keydown', $.proxy(this.loginKey, this));

    this.session_field = this.generateSelect(
        lightdm.sessions,
        lightdm.default_session
    );

    this.language_field = this.generateSelect(
        lightdm.languages,
        lightdm.default_language
    );

    var login_button = $('<button>')
        .addClass('btn btn-primary input-sm')
        .text('Login')
        .on('click', $.proxy(this.loginAdvance, this));

    this.login_message = $('<div>')
        .addClass('form-group')
        .attr('id', 'login_message');

    login_form.append(
        this.login_prompt,
        $('<div class="form-group">').append(this.login_field),
        $('<div class="form-group">').append(this.session_field),
        $('<div class="form-group" style="display: none;">').append(this.language_field),
        login_button,
        this.login_message
    );
    return login_form;
};
LightDMModule.prototype.generatePowerMenu = function() {
    var menu = $('<ul>')
        .addClass('dropdown-menu')
        .attr('role', 'menu');
    var parent = $('<div>')
        .addClass('navbar-right navbar-nav dropdown')
        .attr('id', 'power_dropdown')
        .append($('<a>')
            .addClass('dropdown-toggle btn')
            .attr({
                'data-toggle': 'dropdown',
                'href': '#'
            })
            .append($('<span>')
                .addClass('glyphicon glyphicon-off')
            ),
            menu
        );
    var labels = {'shutdown': 'Herunterfahren', 'restart': 'Neustarten'};
    var anything = false;
    for(action in labels) {
        if(lightdm['can_' + action]) {
            anything = true;
            menu.append(
                $('<li>').append($('<a href="#" role="menuitem">')
                    .append(labels[action])
                    .on('click', $.proxy(this[action], this))
                )
            );
        }
    }
    if(anything)
        return parent;
    else
        return false;
};
LightDMModule.prototype.showUsernameField = function() {
    lightdm.cancel_authentication();
    this.login_prompt.text('Benutzername');
    this.login_field
        .val('')
        .attr('type', 'text')
        .prop('disabled', false)
        .focus();
    this.session_field.selectpicker('val', lightdm.default_session);
};
LightDMModule.prototype.loginAdvance = function() {
    var field = this.login_field;
    if(field.val() == '') {
        field.focus();
        return;
    }
    field.prop('disabled', true);
    if(field.attr('type') == 'text')
        lightdm.start_authentication(field.val());
    else
        lightdm.provide_secret(field.val());
};
LightDMModule.prototype.loginKey = function(ev) {
    if(ev.keyCode == 9/*TAB*/ || ev.keyCode == 13/*Enter*/)
        this.loginAdvance();
    else if(ev.keyCode == 27/*ESC*/)
        this.showUsernameField();
};
LightDMModule.prototype.showPrompt = function(text) {
    this.login_prompt.text(text);
    this.login_field
        .val('')
        .attr('type', 'password')
        .prop('disabled', false)
        .focus();
    var usersession = null;
    for(var i = 0; i < lightdm.users.length; i++)
        if(lightdm.users[i].name == lightdm.authentication_user)
            usersession = lightdm.users[i].session;
    if(usersession) {
        this.session_field.selectpicker('val', usersession);
    }
};
LightDMModule.prototype.showMessage = function(text) {
    var msg = this.login_message;
    msg.text(text);
    setTimeout(function(){msg.text('');}, 15*1000);
};
LightDMModule.prototype.authenticationComplete = function() {
    if (lightdm.is_authenticated) {
        lightdm.login(
            lightdm.authentication_user,
            this.session_field.val(),
            $('option:selected', this.language_field).val()
        );
    }
    else {
        this.showMessage('Error logging in!');
        lightdm.cancel_authentication();
        this.showUsernameField();
    }
};
LightDMModule.prototype.generateSelect = function(options, preset) {
    var parent = $('<select>');
    for(var i = 0; i < options.length; i++) {
        var option = $('<option>')
            .attr('value', options[i].key || options[i].code)
            .text(options[i].name);
        if(preset && (options[i].key == preset || options[i].code == preset))
            option.attr('selected', 'selected');
        parent.append(option);
    }
    return parent;
};

new LightDMModule();
