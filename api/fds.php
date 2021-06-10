<?php
    $cachedir = __DIR__ . '/cache/';
    $res = array(
        "data" => array(),
        "code" => 400,
        "error" => array(),
        "request" => $_REQUEST
    );

    if (!isset($_REQUEST["id"]) || !preg_match("~^[0-9]+$~", $_REQUEST["id"])){
        $res["code"] = 400; 
        $res["error"] = array("msg" => "Bad Request. Request ID must be provided and needs to be numeric.");
    } else {
        $url = "https://fragdenstaat.de/api/v1/request/".$_REQUEST["id"]."/";
        $cache_fn = $cachedir . md5($url) . '.json';
        if (file_exists($cache_fn) && filemtime($cache_fn) > time()-60*60*1){
            $fds_raw = file_get_contents($cache_fn);
            $fds = json_decode($fds_raw, true);
        } else {
            // @TODO: Use curl and send user agent
            $fds_raw = file_get_contents($url);
            $fds = json_decode($fds_raw, true);
            if ($fds){
                file_put_contents($cache_fn, $fds_raw);
            } 
        }

        $data = array(
            "url" => "https://fragdenstaat.de".$fds["url"],
            "status" => $fds["status"]?:"unknown",
            "description" => $fds["description"],
            "last_message" => $fds["last_message"],
            "title" => $fds["title"],
            "costs" => $fds["costs"],
            "messages_count" => sizeof($fds["messages"]),
        );
        //$data["raw"] = $fds; 
        
        $res["data"] = $data;
        $res["code"] = 200; 
    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');
	echo json_encode($res, JSON_PRETTY_PRINT);
?>