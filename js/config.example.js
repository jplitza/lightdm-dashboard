// This file is parsed as both javascript and JSON
// (without the leading "config = " and ignoring //-style comments).
// Thus make it as close to JSON as possible!
config = {
    // root of your backend server (i.e. everything before data.php)
    "approot": "http:\/\/example.org\/dashboard\/",
    // root of your client175 installation to control MPD
    "mpdroot": "https:\/\/example.org\/musik\/",
    // list of modules to load (order matters!)
    "modules": ["BSAGModule","MensaModule","XKCDModule","GW2Module","LightDMModule","TimeModule","MPDModule"],
    // station at which to show departures. get id with modules/BSAGModule/get_station_id.php
    "bsag_station": "000695569"
}
