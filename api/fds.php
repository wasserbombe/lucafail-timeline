<?php
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
        $fds_raw = file_get_contents("https://fragdenstaat.de/api/v1/request/".$_REQUEST["id"]."/"); 
        $fds = json_decode($fds_raw, true);
        $res["data"] = $fds;
        $res["code"] = 200; 
    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');
	echo json_encode($res, JSON_PRETTY_PRINT);
?>