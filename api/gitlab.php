<?php
    $cachedir = __DIR__ . '/cache/';
    $allowed_projects = ['25883425','25531274'];
    $project2projectID = [
        "web" => "25881780",
        "security-overview" => "25883425",
        "cwa-event" => "26885332"
    ];
    $res = array(
        "data" => array(),
        "code" => 400,
        "error" => array(),
        "request" => $_REQUEST
    );

    if (isset($_REQUEST["project"]) && isset($project2projectID[$_REQUEST["project"]])){
        $pid = $project2projectID[$_REQUEST["project"]];
        $_REQUEST["project"] = $pid;
        $allowed_projects[] = $pid;
    }

    if (!isset($_REQUEST["project"]) || !preg_match("~^[0-9]+$~", $_REQUEST["project"]) || !isset($_REQUEST["issue"]) || !preg_match("~^[0-9]+$~", $_REQUEST["issue"])){
        $res["code"] = 400; 
        $res["error"] = array("msg" => "Bad Request. Project ID and Issue ID must be provided and needs to be numeric.");
    } else {
        if (!in_array($_REQUEST["project"], $allowed_projects)){
            $res["code"] = 403; 
            $res["error"] = array("msg" => "Project not allowed.");
        } else {
            // https://gitlab.com/api/v4/projects/25531274/issues/3
            $url = "https://gitlab.com/api/v4/projects/".$_REQUEST["project"]."/issues/".$_REQUEST["issue"];
            $cache_fn = $cachedir . 'gitlab_'.md5($url) . '.json';
            if (file_exists($cache_fn) && filemtime($cache_fn) > time()-60*60*1){
                $gl_raw = file_get_contents($cache_fn);
                $gl = json_decode($gl_raw, true);
            } else {
                // @TODO: Use curl and send user agent
                $gl_raw = file_get_contents($url);
                $gl = json_decode($gl_raw, true);
                if ($gl){
                    file_put_contents($cache_fn, $gl_raw);
                } 
            }

            $desc = $gl["description"];
            //$desc = str_replace("\n", "<br>", $desc);
            $data = array(
                "title" => $gl["title"],
                "description" => $desc,
                "url" => $gl["web_url"],
                "created" => $gl["created_at"],
                "updated" => $gl["updated_at"],
                "author" => $gl["author"],
                "state" => $gl["state"],
            );
            //$data["raw"] = $gl; 
            
            $res["data"] = $data;
            $res["code"] = 200; 
        }
    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');
	echo json_encode($res, JSON_PRETTY_PRINT);
?>