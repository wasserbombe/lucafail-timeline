<?php
    // quick & dirty luca website stats parser
    // TODO: clean up!!

    $cache_fn = __DIR__.'/cache/lucastats.json';
    $cache_fn_fallback = __DIR__.'/cache/lucastats_end.json';
    $cachetime = 60*30; 

    $res = array(
        "code" => 200,
        "meta" => array(
            "origin_cache_ts" => filemtime($cache_fn),
            "generating_cache_ts" => time(),
            "fail" => false,
            "cache_used" => false,
            "cachetime" => $cachetime
        ),
        "metrics" => array()
    ); 

    if (file_exists($cache_fn) && filemtime($cache_fn) > time()-$cachetime){
        $raw = file_get_contents($cache_fn);
        $res["meta"]["cache_used"] = true; 
    } else {
        $raw = file_get_contents("https://www.luca-app.de/");
        file_put_contents($cache_fn, $raw); 
    }

    $doc = new \DOMDocument();
    @$doc->loadHTML($raw);

    $xpath = new \DOMXpath($doc);
    $wrappers = $xpath->query('//div[@class="wpb_wrapper"]');

    
    
    try {
        $existing = array(); 
        foreach ($wrappers as $wrapper){
            if (preg_match("~luca in Zahlen~i", $wrapper->textContent)){
                //$xpath = new \DOMXpath($wrapper);
                $wrappers2 = $wrapper->getElementsByTagName('div');
                foreach ($wrappers2 as $wrapper2){
                    if ($wrapper2->getAttribute("class") == "wpb_wrapper"){
                        $ps = $wrapper2->getElementsByTagName("p");
                        foreach ($ps as $p){
                            $text = $p->textContent; 
                            if (in_array($text, $existing)) continue; 
                            $existing[] = $text; 
                            if (preg_match("~^>? ?([0-9,\.]*) (Mio)?([a-z :0-9-]*) Stand: (.+) Uhr~i", $text, $matches)){
                                $metric = array("_raw" => $text); 
                                $val = $matches[1];
                                $val = str_replace(".", "", $val); 
                                $val = str_replace(",", ".", $val); 
                                $val = doubleval($val); 
                                if (preg_match("~mio~i", $matches[2])) $val = $val * 1000000;
                                $metric["value"] = $val;
                                
                                $ex_name = explode(" innerhalb der letzten ", $matches[3]);
                                if (sizeof($ex_name) == 2){
                                    $metric["name"] = trim($ex_name[0]); 
                                    $metric["range"] = trim($ex_name[1]); 
                                } else {
                                    $metric["name"] = trim($matches[3]);
                                }
                                $metric["name"] = ucfirst($metric["name"]);

                                $stand = $matches[4];
                                if (preg_match("~([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})[^0-9]*([0-9]{1,2}:[0-9]{2})~i", $stand, $matches_stand)){
                                    $ts = strtotime($matches_stand[3].'-'.$matches_stand[2].'-'.$matches_stand[1].' '.$matches_stand[4]);
                                    $metric["stand_ts"] = $ts; 
                                    $metric["stand_datetime"] = date("Y-m-d H:i:s", $ts); 
                                }
                                $stand = str_replace(" \u2013 ", " ", $stand); 
                                $metric["stand"] = $stand;
      
                                $res["metrics"][] = $metric; 
                            }
                        }
                    }
                }
            }
        }
    } catch (Exception $e){
        $res["fail"] = true; 
        
    }

    if (sizeof($res["metrics"]) < 2) $res["fail"] = true; 

    if ($res["fail"] == true){
        $raw = file_get_contents($cache_fn_fallback);
        $raw = json_decode($raw, true);
        $res["metrics"] = $raw;
    } else {
        file_put_contents($cache_fn_fallback, json_encode($res["metrics"], JSON_PRETTY_PRINT));
    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');

    echo json_encode($res, JSON_PRETTY_PRINT); 
?>