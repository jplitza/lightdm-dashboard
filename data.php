<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Berlin');
ini_set('default_socket_timeout', 2);

// Your custom class dir
define('MODULES_DIR', './modules');

function is_class_name($str) {
    return preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $str);
}

// Use default autoload implementation
spl_autoload_register(function($class_name) {
    if(!is_class_name($class_name))
        return false;
    include_once(MODULES_DIR . '/' . $class_name . '/' . $class_name . '.class.php');
});

if(!empty($_GET['module']) && is_class_name($_GET['module']) && is_dir(MODULES_DIR . '/' . $_GET['module'])) {
    $module = new $_GET['module']();
    $data = $module->get_data();
    echo json_encode($data);
}
