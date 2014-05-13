<?php
if(!isset($GLOBALS['mensa'])) {
    require_once(MODULES_DIR . '/MensaModule/stdwerk-bremen/mensa_new_config.php');
    $GLOBALS['mensa'] = get_defined_vars();
}

class GW2Module extends MensaModule {
    public $key = 'gw2';

    public function get_data() {
        $gw2 = $this->get_mensa_data($GLOBALS['mensa']['gw2_url'], $GLOBALS['mensa']['gw2_match'], $GLOBALS['mensa']['gw2_cache_file'], 1430);
        if(!$gw2 || count($gw2) == 1)
            return array('date' => strtotime($gw2['datum']), 'dishes' => array());
        else {
            return array('date' => strtotime($gw2['datum']), 'dishes' => array(
                array('name' => 'Pizza', 'meal' => $gw2['pizza']),
                array('name' => 'Pasta', 'meal' => $gw2['pasta']),
                array('name' => 'Front Cooking', 'meal' => $gw2['frontcooking']),
                array('name' => 'Suppe', 'meal' => $gw2['suppe']),
            ));
        }
    }
}
