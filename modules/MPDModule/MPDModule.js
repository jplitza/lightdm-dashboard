function MPDModule() {
    this.toggle_button = $('<span>').addClass('glyphicon glyphicon-play');
    this.next_button = $('<span>')
        .addClass('glyphicon glyphicon-fast-forward')
        .on('click', $.proxy(function() {
            this.command('next');
        }, this));
    this.now_playing = $('<span>')
    this.root = $('<span>')
        .addClass('navbar-right navbar-text mpd')
        .append(
            $('<a>')
                .addClass('btn btn-xs')
                .append(this.toggle_button),
            this.now_playing,
            $('<a>')
                .addClass('btn btn-xs')
                .append(this.next_button)
        );
    $('#panel').append(this.root);

    this.getData();
}

MPDModule.prototype = Object.create(BaseModule.prototype);
MPDModule.prototype.constructor = MPDModule;
MPDModule.prototype.key = 'mpd';
MPDModule.prototype.timeoutHandle = false;
MPDModule.prototype.getData = function() {
    $.ajax(config['mpdroot'] + "status", {"dataType": "json"})
        .done($.proxy(this.update, this))
        .fail(this.root.hide());
};
MPDModule.prototype.update = function(data) {
    if(this.timeoutHandle)
        clearTimeout(this.timeoutHandle);

    if(data.title) {
        this.now_playing.text((data.artist ? data.artist + " – " : "") + data.title);
        if(data.state == "pause" || data.state == "stop")
            this.toggle_button
                .removeClass("glyphicon-pause")
                .addClass("glyphicon-play")
                .off("click")
                .on("click", $.proxy(function() {
                    this.command('play')
                }, this));
        else
            this.toggle_button
                .removeClass("glyphicon-play")
                .addClass("glyphicon-pause")
                .off("click")
                .on("click", $.proxy(function() {
                    this.command('pause')
                }, this));
    } else {
        this.now_playing.text("Stopped");
    }
    this.root.show();
    var nextupdate = data.time - data.elapsed;
    if(nextupdate < 10)
        nextupdate = 10;
    if(nextupdate > 120)
        nextupdate = 120;
    console.debug("Next update of MPD pane in " + nextupdate + " seconds")
    this.timeoutHandle = setTimeout($.proxy(this.getData, this), nextupdate * 1000);
};
MPDModule.prototype.command = function(command) {
    $.ajax(config['mpdroot'] + command)
        .done($.proxy(function(data, textStatus, jqXHR) {
            setTimeout($.proxy(this.update, this), 300);
        }, this));
};

new MPDModule();
