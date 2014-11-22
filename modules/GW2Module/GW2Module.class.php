<?php

class GW2Module extends MensaModule {
    public function get_data() {
      $day = time() <= strtotime("14:30") ? strtotime("0:00") : strtotime("0:00 +1 day");
      return parse_mensa("http://www.stw-bremen.de/de/essen-trinken/cafeteria-gw2", $day);
    }
}
