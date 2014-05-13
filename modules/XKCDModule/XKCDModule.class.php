<?php
class XKCDModule extends BaseModule {
    public $key = 'xkcd';

    private function decode_entities($text) {
        $text= html_entity_decode($text,ENT_QUOTES,"ISO-8859-1"); #NOTE: UTF-8 does not work!
        $text= preg_replace('/&#(\d+);/me',"chr(\\1)",$text); #decimal notation
        $text= preg_replace('/&#x([a-f0-9]+);/mei',"chr(0x\\1)",$text);  #hex notation
        return $text;
    }

    public function get_data() {
        $tmp = file_get_contents('https://m.xkcd.com/');
        preg_match('/<img id="comic" (?:(?:alt="(?P<alt>[^"]*)"|src="(?P<src>[^"]+)"|title="(?P<title>[^"]*)"|[^ ]+) )+\/>/', $tmp, $xkcd);
        unset($xkcd[3], $xkcd[2], $xkcd[1], $xkcd[0]);
        return array_map(array($this, "decode_entities"), $xkcd);
    }

    public function get_javascript() {}
}
