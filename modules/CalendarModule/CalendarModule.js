function CalendarModule() {
    this.loadStylesheet();
    this.root = this.makeWell($('<h2>').text('Kalender'));

    this.setInterval(5*60*1000); // 5 minutes
}

CalendarModule.prototype = Object.create(BaseModule.prototype);
CalendarModule.prototype.constructor = CalendarModule;
CalendarModule.prototype.update = function(data) {
    var months = new Array("Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez");
    var template = $('<div class="infoblock"><h3></h3></div>');
    var eventtemplate = $('<li><span class="date"><span class="day"></span><span class="hidden">. </span><span class="month"></span></span> <span class="time"></span> <span class="title"></span></li>');
    var elements = new Array(data.length);
    for(var i = 0; i < data.length; i++) {
        elements[i] = template.clone();
        var newevent;
        $('h3', elements[i]).append(document.createTextNode(data[i].name));
        for(var j = 0; j < data[i].events.length; j++) {
            newevent = eventtemplate.clone();
            var startdate = new Date(data[i].events[j].start*1000);
            var enddate = new Date(data[i].events[j].end*1000);
            $(".day", newevent).append(document.createTextNode(startdate.getDate()));
            $(".month", newevent).append(document.createTextNode(months[startdate.getMonth()]));
            $(".time", newevent).append(document.createTextNode(formatTime(startdate) + "–" + formatTime(enddate)));
            $(".title", newevent).append(document.createTextNode(data[i].events[j].title));
            elements[i].append(newevent);
        }
    }
    $(".infoblock", this.root).remove();
    this.root.append(elements);
};

new CalendarModule();
