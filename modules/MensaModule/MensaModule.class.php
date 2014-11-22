<?php
require_once("mensa-parser/mensa_parser.php");

class MensaModule extends BaseModule {
    
    public function get_data() {
        $day = time() <= strtotime("14:00") ? strtotime("0:00") : strtotime("0:00 +1 day");
        return parse_mensa("http://www.stw-bremen.de/de/essen-trinken/uni-mensa", $day);
    }
}
