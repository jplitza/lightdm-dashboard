<?php
class XKCDModule extends BaseModule {
    public $key = 'xkcd';

    public function get_data() {
        $json = file_get_contents('http://xkcd.com/info.0.json');
        $obj = json_decode($json);
        $json_obj->alt = $obj->{'title'};
        $json_obj->src = $obj->{'img'};
        $json_obj->title = $obj->{'alt'};
        return $json_obj;
    }
}
