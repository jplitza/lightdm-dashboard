function BaseModule() {}
BaseModule.prototype.data = {};
BaseModule.prototype.intervalHandle = false;
BaseModule.prototype.setInterval = function(interval) {
    if(this.intervalHandle)
        clearInterval(this.intervalHandle);
    this.intervalHandle = setInterval($.proxy(this.getData, this), interval);
    this.getData();
};
BaseModule.prototype.getData = function() {
    $.ajax(config['approot'] + "/data.php?module=" + this.constructor.name)
        .done(
            $.proxy(function(data, textStatus, jqXHR) {
                this.update(data);
            }, this)
        );
};
BaseModule.prototype.recall = function(f) {
    if(f.timeoutHandle)
        clearTimeout(f.timeoutHandle)
    var nextcall = f.call(this);
    f.timeoutHandle = setTimeout(
        $.proxy(function() { this.recall(f); }, this),
        nextcall
    );
};
BaseModule.prototype.makeWell = function() {
    var well = $('<div>').addClass("well").addClass(this.constructor.name);
    well.append.apply(well, arguments);
    $('body').append(
        $('<div class="widget">').append(well)
    );
    return well;
};
BaseModule.prototype.loadStylesheet = function() {
    $('head').append(
        $('<link>')
            .attr('href', 'modules/' + this.constructor.name + '/style.css')
            .attr('rel', 'stylesheet')
    );
};
