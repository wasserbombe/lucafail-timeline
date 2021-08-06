<?php
    // extremly (!) simple proxy script to proxy the OSM tiles
    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    // https://a.tile.openstreetmap.org/12/2198/1344.png

    $params = [
        "s" => "~^[a-z0-9]+$~i",
        "z" => "~^[0-9]+$~i",
        "x" => "~^[0-9]+$~i",
        "y" => "~^[0-9]+$~i",
    ];
    $noncacheparams = ['s'];

    $valid = true; 
    foreach ($params as $param => $pattern){
        if (!isset($_REQUEST[$param]) || (empty($_REQUEST[$param]) && $_REQUEST[$param] !== "0") || !preg_match($pattern, $_REQUEST[$param])){
            $valid = false; 
            break; 
        }
    }
    
    if (!$valid){
        http_response_code(400); 
    } else {
        $url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'; 
        $cacheurl = $url; 
        foreach ($params as $param => $pattern){
            $url = str_replace("{".$param."}", $_REQUEST[$param], $url);
            if (!in_array($param, $noncacheparams)){
                $cacheurl = str_replace("{".$param."}", $_REQUEST[$param], $cacheurl);
            }
            
        }

        $cache_filename = __DIR__.'/cache/tile_'.md5($cacheurl).'.png';
        if (file_exists($cache_filename) && filemtime($cache_filename) > time()-60*60*24*3){
            $tile = file_get_contents($cache_filename);
        } else {
            $opts = array('http'=>array('header' => "User-Agent: timeline.luca.fail/1.0\r\n"));
            $context = stream_context_create($opts);
            $tile = file_get_contents($url, false, $context); 
            if ($tile){
                file_put_contents($cache_filename, $tile); 
            }
        }

        header ('Content-Type: image/png'); 
        echo $tile; 
    }
?>