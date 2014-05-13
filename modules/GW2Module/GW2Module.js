function GW2Module() {
    MensaModule.call(this);
}

GW2Module.prototype = Object.create(MensaModule.prototype);
GW2Module.prototype.constructor = GW2Module;
GW2Module.prototype.title = 'GW2';

new GW2Module();
