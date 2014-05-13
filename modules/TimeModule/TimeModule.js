function TimeModule() {
    $('#panel')
        .append($('<span>')
            .addClass('navbar-right navbar-text')
            .attr('id', 'time')
        );
    this.recall(this.update);
}

TimeModule.prototype = Object.create(BaseModule.prototype);
TimeModule.prototype.constructor = TimeModule;
TimeModule.prototype.timeoutHandle = false;
TimeModule.prototype.update = function() {
    var now = new Date;
    $('#time').text(this.formatTime(now));
    return 60*1000 - (now.getSeconds()*1000 + now.getMilliseconds());
};
TimeModule.prototype.formatTime = function(time) {
    return ("0"+time.getHours()).slice(-2)
        + ":"
        + ("0"+time.getMinutes()).slice(-2);
};

new TimeModule();
