<?php
class BSAGModule extends BaseModule {
    public $key = 'bsag';

    private function file_get_contents_post($url, $post_data) {
        $options = array('http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => $post_data
        ));
        $context = stream_context_create($options);
        return file_get_contents($url, false, $context);
    }

    public function get_data() {
        $bsag_url = "http://62.206.133.180/bsag/XSLT_DM_REQUEST";
        $bsag_post = array(
            'command'   => '',
            'deleteAssignedStops_dm' => 1,
            'itdDateDay' => date('d'),
            'itdDateMonth' => date('m'),
            'itdDateYear' => date('Y'),
            'itdLPxx_id_dm' => ':dm',
            'itdLPxx_mapState_dm' => '',
            'itdLPxx_mdvMap2_dm' => '',
            'itdLPxx_mdvMap_dm' => '3406199:401077:NAV3',
            'itdLPxx_transpCompany' => 'bsag',
            'itdLPxx_view' => '',
            'itdTimeHour' => date('H'),
            'itdTimeMinute' => date('i'),
            'language'  => 'de',
            'nameInfo_dm' => 'invalid',
            'nameState_dm' => 'empty',
            'name_dm' => utf8_decode('Universität/Zentralbereich'),
            'placeInfo_dm' => 'invalid',
            'placeState_dm' => 'empty',
            'place_dm' => 'Bremen',
            'ptOptionsActive' => 1,
            'requestID' => 0,
            'sessionID' => 0,
            'submitButton' => 'anfordern',
            'typeInfo_dm' => 'invalid',
            'type_dm' => 'stop',
            'useProxFootSearch' => 0,
            'useRealtime' => 1,
        );
        $bsag_result = $this->file_get_contents_post($bsag_url, http_build_query($bsag_post));
        $dom = new DOMDocument;
        $dom->loadHTML($bsag_result);
        $bsag_post = array();
        foreach($dom->getElementsByTagName('input') as $node) {
            $type = $node->getAttribute('type');
            if($type == 'hidden' || $type == 'submit')
                $bsag_post[$node->getAttribute('name')] = $node->getAttribute('value');
        }
        # lines to fetch, get values by manual inspecting the site
        $bsag_post['dmLineSelection'] = array('4:1', '4:2', '5:1', '5:3', '5:4', '5:6');
        $bsag_content = preg_replace('#%5B\d+%5D#', '', http_build_query($bsag_post));
        $bsag_result = $this->file_get_contents_post($bsag_url, $bsag_content);
        $dom->loadHTML($bsag_result);
        $xpath = new DOMXPath($dom);
        $tables = $xpath->query('//table//table//table[count(.//tr)>=4]');
        $connections = array();
        $now = time();
        if($tables->length == 1) {
            $table = $tables->item(0);
            foreach($xpath->query('./tr', $table) as $tr) {
                if(strncmp($tr->getAttribute('class'), 'bgColor', 7))
                    continue;
                $tds = $xpath->query('./td', $tr);
                $time = strtotime($tds->item(1)->nodeValue);
                if($time < $now)
                    continue;
                $line = $tds->item(4)->nodeValue;
                $type = strtolower($xpath->query('./img/@alt', $tds->item(3))->item(0)->nodeValue);
                if(!array_key_exists($line, $connections)) {
                    $connections[$line] = array('line' => $line, 'type' => $type, 'connections' => array());
                }
                $connections[$line]['connections'][] = $time;
            }
        }
        ksort($connections);
        return array_values($connections);
    }

    public function get_javascript() {
        return "";
    }
}
