for(var i = 0; i < config['modules'].length; i++) {
    console.debug("Loading " + config['modules'][i]);
    var path = 'modules/' + config['modules'][i] + '/' + config['modules'][i] + '.js';
    document.write('<script src="' + path + '" type="text/javascript"></script>');
}
