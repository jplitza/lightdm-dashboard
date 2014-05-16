function BSAGModule() {
    this.loadStylesheet();

    this.table = $('<table>');
    this.makeWell(
        $('<h2>BSAG <span class="small">Abfahrt in Minuten</span></h2>'),
        this.table
    );

    this.setInterval(15*60*1000); // 15 minutes
}

BSAGModule.prototype = Object.create(BaseModule.prototype);
BSAGModule.prototype.constructor = BSAGModule;
BSAGModule.prototype.timeoutHandle = false;
BSAGModule.prototype.update = function(data) {
    this.data = data;
    this.recall(this.paint);
};
BSAGModule.prototype.paint = function() {
    var template = $('<tr><th><span></span></th><td></td></tr>');
    var elements = new Array(this.data.length);
    var time = new Date;
    var nextupdate = 60;
    for(var i = 0; i < this.data.length; i++) {
        elements[i] = template.clone();
        $('span', elements[i])
            .addClass(this.data[i].type)
            .addClass('line' + this.data[i].line)
            .text(this.data[i].line);
        var connections = new Array();
        for(var j = 0; j < this.data[i].connections.length; j++) {
            var connection = this.data[i].connections[j]-time.getTime()/1000;
            if(connection < 0)
                continue;
            connections.push(Math.ceil(connection/60));
            if(connection % 60 < nextupdate)
                nextupdate = connection % 60;
        }
        $('td', elements[i]).text(connections.join(", "));
    }
    $('tr', this.table).remove();
    this.table.append(elements);
    console.debug('Next update of BSAG pane in ' + nextupdate + ' seconds')
    return nextupdate * 1000;
}

new BSAGModule();
