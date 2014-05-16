<?php
class BSAGModule extends BaseModule {
    public $key = 'bsag';

    private function file_get_contents_post($url, $post_data) {
        $options = array('http' => array(
            'header' => "Content-type: text/plain;charset=UTF-8\r\n",
            'method' => 'POST',
            'content' => $post_data
        ));
        $context = stream_context_create($options);
        return file_get_contents($url, false, $context);
    }

    private function make_input_triple($data) {
        $out = array();
        foreach($data as $k => $v) {
            $out[] = $k . '=' . $v;
        }
        $out[] = '';
        return implode('@', $out);
    }

    public function get_departures($station, $time = null) {
        if(!$time)
            $time = time();
        /*
         * I obtained these request values by reverse modifying the request made
         * by the "Fahrplaner" app.
         * Everything that wasn't needed at the time of writing is commented out
         * to not forge any statistics on their end or reveal too much
         * information on our end. It is still contained in this file in case
         * it's needed later on due to API changes or stricter input checking.
         */
        $bsag_url = "http://fahrplaner.vbn.de/bin/stboard.exe/dn";
        $bsag_post = array(
            'productsFilter' => '11111111111111',
            'boardType' => 'dep',
            'L' => 'vs_java3',
            'date' => date('d.m.Y', $time),
            'time' => date('H:i', $time),
            'maxJourneys' => '50',
            'start' => 'yes',
            'inputTripelId' => $this->make_input_triple(array(
                'O' => $station,
                'L' => '000695569',
                #'A' => 1,
                #'X' => '8852217',
                #'Y' => '53107604',
                #'U' => 80,
                #'B' => 1,
                #'V' => '4.9,',
                #'p' => '1400092940',
            )),
            #'clientSystem' => 'Android17',
            #'hcount' => '1',
            #'androidversion' => '2.2.14',
            #'clientDevice' => 'GT-I9100G',
            #'htype' => 'GT-I9100G',
            #'clientType' => 'ANDROID',
        );
        $result_str = $this->file_get_contents_post($bsag_url, http_build_query($bsag_post));
        $result = new SimpleXMLElement($result_str);

        $connections = array();
        $now = time();
        foreach($result->Journey as $connection) {
            preg_match('/^(\w+) (\d+[ES]?)#\1$/', $connection['prod'], $matches);
            if($matches) {
                list(, $type, $line) = $matches;
                if(!isset($connections[$line]))
                    $connections[$line] = array(
                        'line' => $line,
                        'type' => strtolower($type),
                        'connections' => array()
                    );
                $time = strtotime($connection['fpTime']);
                if($time < $now)
                    continue;
                $connections[$line]['connections'][] = strtotime($connection['fpTime']);
            }
        }
        return $connections;
    }

    public function get_data() {
        global $config;
        $connections = $this->get_departures($config['bsag_station']);
        ksort($connections);
        return array_values($connections);
    }
}
