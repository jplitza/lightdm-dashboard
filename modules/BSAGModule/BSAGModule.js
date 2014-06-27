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
    var template = $('<tr><th><span></span></th><td></td><td></td><td></td><td></td></tr>');
    var elements = new Array(this.data.length);
    var time = new Date;
    var nextupdate = 60;
    for(var i = 0; i < this.data.length; i++) {
        elements[i] = template.clone();
        $('span', elements[i])
            .addClass(this.data[i].type)
            .addClass('line' + this.data[i].line)
            .text(this.data[i].line);
        this.data[i].directions.sort(function(a,b) {
            var ai = config.bsag_priorities.indexOf(a.direction);
            var bi = config.bsag_priorities.indexOf(b.direction);
            console.log(a.direction + ai + " vs " + b.direction + bi);
            if(ai == bi)
                return 0;
            else if(ai == -1 || (bi < ai && bi != -1))
                return 1;
            else
                return -1;
        });
        for(var k = 0; k < this.data[i].directions.length; k++) {
            var connections = new Array();
            for(var j = 0; j < this.data[i].directions[k].connections.length; j++) {
                var connection = this.data[i].directions[k].connections[j]-time.getTime()/1000;
                if(connection < 0)
                    continue;
                connections.push(Math.ceil(connection/60));
                if(connection % 60 < nextupdate)
                    nextupdate = connection % 60;
            }
            var dir = this.data[i].directions[k].direction;
            // to save some space, restrict the direction to the first word
            dir = dir.split(" ", 1)[0];
            $('td', elements[i]).eq(2*k).text(dir);
            $('td', elements[i]).eq(2*k+1).text(connections.join("\u200B,\u00A0"));
        }
    }
    $('tr', this.table).remove();
    this.table.append(elements);
    console.debug('Next update of BSAG pane in ' + nextupdate + ' seconds')
    return nextupdate * 1000;
}

new BSAGModule();
