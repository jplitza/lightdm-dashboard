function MensaModule() {
    this.loadStylesheet();

    this.table = $('<table>');
    this.date = $('<span>').addClass('small');
    this.root = this.makeWell(
        $('<h2>').text(this.title).append(this.date),
        this.table
    );

    this.setInterval(60*60*1000); // 60 minutes
}

MensaModule.prototype = Object.create(BaseModule.prototype);
MensaModule.prototype.constructor = MensaModule
MensaModule.prototype.title = 'Mensa';
MensaModule.prototype.update = function(data) {
    var template = $('<tr><th></th><td></td></tr>');
    var elements = new Array(data.dishes.length);
    for(var i = 0; i < data.dishes.length; i++) {
        elements[i] = template.clone();
        $('th', elements[i]).append(data.dishes[i].name);
        $('td', elements[i]).text(data.dishes[i].meal);
    }
    var date = new Date(data.date*1000);
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    var informal = "";
    if(this.sameDate(date, today))
        informal = "von heute";
    else if(this.sameDate(date, tomorrow))
        informal = "von morgen";
    else
        informal = "vom " + date.toLocaleDateString();
    this.table.empty().append(elements);
    this.date.text(" " + informal);
};
MensaModule.prototype.sameDate = function(a, b) {
    return a.getDate()  == b.getDate()
        && a.getMonth() == b.getMonth()
        && a.getYear()  == b.getYear();
}

new MensaModule();
