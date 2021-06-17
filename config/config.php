<?php
    require_once __DIR__ . '/../lib/DB/DB.php';

    $_CONFIG = array(
        'database' => array(
            'dbtwitter' => include __DIR__.'/credentials/db.twitter.php'
        )
    );

    $DB_TWT = new \Interdose\DB('dbtwitter');
?>