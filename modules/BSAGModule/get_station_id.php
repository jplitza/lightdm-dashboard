<?php
if($_SERVER['argc'] != 2) {
    echo "Usage: php " . basename(__FILE__) . " <stop>\n";
    exit;
}

$output = file_get_contents('http://fahrplaner.vbn.de/hafas/ajax-getstop.exe/dny?start=1&REQ0JourneyStopsS0A=1&REQ0JourneyStopsB=12&S=' . urlencode($_SERVER['argv'][1]) . '&js=true&');
preg_match_all('/@O=(?P<station>[^@]+)[^"]*L=(?P<id>\d+)@/', $output, $matches, PREG_SET_ORDER);
foreach($matches as $match) {
    echo $match['station'] . ": " . $match['id'] . "\n";
}
