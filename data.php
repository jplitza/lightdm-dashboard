<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Berlin');
ini_set('default_socket_timeout', 2);

// Your custom class dir
define('CLASS_DIR', './modules');

// Add your class dir to include path
set_include_path(get_include_path().PATH_SEPARATOR.CLASS_DIR);

// You can use this trick to make autoloader look for commonly used "My.class.php" type filenames
spl_autoload_extensions('.class.php');

// Use default autoload implementation
spl_autoload_register(function($class_name) {
    // This is basicly the default implementation, save it can handle CamelCase...
    if(!preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $class_name))
        return false;
    foreach(explode(',', spl_autoload_extensions()) as $extension) {
        if(include_once($class_name . $extension))
            break;
    }
});

$modules = array('BSAGModule', 'MensaModule', 'GW2Module', 'XKCDModule');
$data = array();

foreach($modules as $module_name) {
    $module = new $module_name();
    $data[$module->key] = $module->get_data();
}

echo json_encode($data);
