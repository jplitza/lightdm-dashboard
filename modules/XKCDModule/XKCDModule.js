function XKCDModule() {
    this.loadStylesheet();
    this.well = this.makeWell();
    this.setInterval();
}

XKCDModule.prototype = Object.create(BaseModule.prototype);
XKCDModule.prototype.constructor = XKCDModule;
XKCDModule.prototype.interval = 6*60*60*1000; // 6 hours
XKCDModule.prototype.update = function(data) {
    this.well.empty();
    this.well.append(
        $('<h2>').text(data.alt),
        $('<img>')
            .attr('src', data.src)
            .attr('alt', data.alt)
            .attr('title', data.title)
    );
}

new XKCDModule();
