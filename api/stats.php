<?php
    include __DIR__ . '/../config/config.php';

    $res = array(
        "data" => array(),
        "code" => 400,
        "error" => array(),
        "request" => $_REQUEST
    );

    if (isset($_REQUEST["view"]) && !empty($_REQUEST["view"])){
        $_REQUEST["view"] = strtolower($_REQUEST["view"]);
        if ($_REQUEST["view"] == 'twt_tweets-per-day'){
            $rows = $DB_TWT->query("SELECT 
                                    LEFT(t.`created_at`, 10) AS 'date', 
                                    COUNT(*) AS 'count',
                                    COUNT(DISTINCT t.`user_id`) AS 'users',
                                    COUNT(*)/COUNT(DISTINCT t.`user_id`) AS 'tweets_per_user'
                                FROM tweets t
                                GROUP BY LEFT(t.`created_at`, 10)")->fetchAll(); 
            foreach ($rows as $row){
                $res["data"][] = array(
                    "date" => $row["date"],
                    "tweets" => intval($row["count"]),
                    "users" => intval($row["users"]),
                    "tweets_per_user" => floatval($row["tweets_per_user"])
                );
            }
            $res["code"] = 200; 
        } elseif ($_REQUEST["view"] == 'twt_hashtags'){
            $rows = $DB_TWT->query("SELECT h2t.`hashtag`, COUNT(*) AS 'tweets'
                                    FROM hashtag2tweet h2t
                                    GROUP BY h2t.`hashtag`
                                    ORDER BY COUNT(*) DESC;")->fetchAll(); 
            foreach ($rows as $row){
                $res["data"][] = array(
                    "hashtag" => $row["hashtag"],
                    "tweets" => intval($row["tweets"])
                );
            }
            $res["code"] = 200; 
        } else {
            $res["code"] = 404;
            $res["error"] = array("msg" => "Unknown view."); 
        }
    } else {
        $res["code"] = 400;
        $res["error"] = array("msg" => "Bad request. Parameter 'view' is required.");
    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');
	echo json_encode($res, JSON_PRETTY_PRINT);
?>