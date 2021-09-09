<?php
    require_once __DIR__ . '/../lib/DB/DB.php';

    $_CONFIG = array(
        'database' => array(
            'dbtwitter' => include __DIR__.'/credentials/db.twitter.php',
            'dbreviews' => include __DIR__.'/credentials/db.reviews.php'
        )
    );

    $DB_TWT = new \Interdose\DB('dbtwitter');
    $DB_REVIEWS = new \Interdose\DB('dbreviews');
?>