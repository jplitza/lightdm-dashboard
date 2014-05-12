<?php
if(!isset($GLOBALS['mensa'])) {
    require_once('stdwerk-bremen/mensa_new_config.php');
    $GLOBALS['mensa'] = get_defined_vars();
}
require_once("stdwerk-bremen/mensa_new.php");

class MensaModule extends BaseModule {
    public $key = 'mensa';

    protected function get_mensa_data($url, $match, $file, $closingtime = 2359) {
        $json = get_mensa_json($file);

        if (!$json)
            $json = refresh_mensa($url, $match, $file);

        $data = json_decode($json, true);
        if(strtotime($data['datum']['v'][count($data['datum']['v'])-1]) < strtotime('0:00')) {
            $json = refresh_mensa($url, $match, $file);
            $data = json_decode($json, true);
        }

        $searchstamp = date('Hi') <= $closingtime? time() : strtotime('+1 day');
        $searchdate = date('d.m.Y', $searchstamp);
        $index = @array_search($searchdate, $data['datum']['v']);
        if($index === FALSE || $index === NULL)
            return array('datum' => $searchdate);
        return array_map(
                create_function('$arr', "return \$arr['v'][$index];"
            ), $data);
    }

    public function get_data() {
        $mensa = $this->get_mensa_data($GLOBALS['mensa']['mensa_url'], $GLOBALS['mensa']['mensa_match'], $GLOBALS['mensa']['mensa_cache_file'], 1415);
        if(!$mensa || count($mensa) == 1)
            return array('date' => strtotime($mensa['datum']), 'dishes' => array());
        else {
            $beilagen = explode(' |,| ', $mensa['beilagen']);
            $beilagen = array_filter($beilagen, create_function('$v', 'return substr($v, 0, 13) != "Pommes frites" && substr($v, 0, 12) != "Baked potato";'));
            $beilagen = implode(', ', $beilagen);
            $mensa = array('date' => strtotime($mensa['datum']), 'dishes' => array(
                array('name' => 'Essen 1', 'meal' => $mensa['essen1']),
                array('name' => 'Essen 2', 'meal' => $mensa['essen2']),
                array('name' => 'Vege&shy;tarisch', 'meal' => $mensa['vegetarisch']),
                array('name' => 'Wok &amp; Pfanne', 'meal' => $mensa['wok']),
                array('name' => 'Beilagen', 'meal' => $beilagen),
            ));
        }
        return $mensa;
    }

    public function get_javascript() {}
}
