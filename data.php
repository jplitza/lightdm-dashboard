<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Europe/Berlin');
ini_set('default_socket_timeout', 2);

define('MODULES_DIR', './modules');
define('CONFIG_PATH', './js/config.js');

function is_class_name($str) {
    return preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $str);
}

// Use default autoload implementation
spl_autoload_register(function($class_name) {
    if(!is_class_name($class_name))
        return false;
    include_once(MODULES_DIR . '/' . $class_name . '/' . $class_name . '.class.php');
});

if(is_file(CONFIG_PATH)) {
    $tmp = file_get_contents(CONFIG_PATH);
    $tmp = preg_replace('#//.*\n#', '', $tmp);
    $tmp = preg_replace('/^\w+\s*=\s*\{/', '{', $tmp);
    $config = json_decode($tmp, true);
}

$module = null;
if(!empty($_GET['module']))
    $module = $_GET['module'];
if(!empty($_SERVER['argc']) && $_SERVER['argc'] > 1)
    $module = $_SERVER['argv'][1];

if($module && is_class_name($module) && is_dir(MODULES_DIR . '/' . $module)) {
    $obj = new $module();
    $data = $obj->get_data();
    echo json_encode($data);
}
