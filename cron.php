<?php
    // update timeline JSON with relevant data
    $fn = __DIR__.'/data/timeline_data.json'; 
    $fn_min = str_replace(".json", ".min.json", $fn); 
    $json = file_get_contents($fn); 
    $data = json_decode($json, true); 

    $data["meta"] = array(
        "git" => array(
            "commit_sh" => str_replace("\n","", `git log --pretty="%h" -n1 HEAD`),
            "commit_lh" => str_replace("\n","", `git log --pretty="%H" -n1 HEAD`),
            "commit_date" => str_replace("\n","", `git log --pretty="%ci" -n1 HEAD`),
            "github" => "https://github.com/wasserbombe/lucafail-timeline"
        ),
        "urls" => [
            "https://timeline.luca.fail/",
            "https://timeline.luca.fail/?date={{YYYY-MM-DD}}",
            "https://timeline.luca.fail/?panel={{id}}",
            "https://timeline.luca.fail/?panel={{id_readable}}"
        ],
        "ts" => time(),
        "date" => date("Y-m-d")
    ); 

    $useForPanelID = ["date","type","title"];
    $longIDs = $shortIDs = array(); 

    foreach ($data["timeline"] as $t => &$panel){
        $longID = []; 
        foreach ($useForPanelID as $prop){
            if (isset($panel[$prop]) && !empty($panel[$prop])){
                if ($prop == "date"){
                    $date = date("Y-m-d", strtotime($panel[$prop]));
                    $longID[] = $date;
                } else {
                    $txt = $panel[$prop];
                    $txt = str_replace(" ", "-", $txt);
                    $txt = preg_replace("~[^a-z0-9-]~i", "", $txt);
                    $longID[] = $txt;
                }
            }
        }

        $longID = implode("_", $longID); 
        if (!isset($panel["id_readable"])) {
            while (in_array($longID, $longIDs)){
                $longID .= rand(0,9); 
            }
            $panel["id_readable"] = $longID; 
        }
        if (!isset($panel["id"])) {
            $shortID = substr(md5($longID),0,12);
            while (in_array($shortID, $shortIDs)){
                $shortID .= rand(0,9);
            }
            $panel["id"] = $shortID; 
        }

        $shortIDs[] = $panel["id"];

        if (!isset($panel["dt_created"])){
            $panel["dt_created"] = date("Y-m-d H:i:s", strtotime($panel["date"]));
        }
        if (!isset($panel["dt_updated"])){
            $panel["dt_updated"] = date("Y-m-d H:i:s", strtotime($panel["date"]));
        }

        ksort($panel);
    }

    file_put_contents($fn, json_encode($data, JSON_PRETTY_PRINT));
    file_put_contents($fn_min, json_encode($data));
?>