<?php
$config = array(
    // which modules to load
    'modules' => array('BSAGModule', 'MensaModule', 'GW2Module', 'XKCDModule'),
    // the root of your client175 installation to control MPD
    'mpd_root' => 'http://example.com/musik/'
);

// don't change anything below here
if(!defined('DASHBOARD_BACKEND')) {
    $config['approot'] = 'http' . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on')? 's' : '') . '://' . $_SERVER['SERVER_NAME'] . dirname($_SERVER['REQUEST_URI']) . '/';
    echo 'config=' . json_encode($config);
}
