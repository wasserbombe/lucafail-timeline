<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">

        <link href="css/main.css" rel="stylesheet">
    </head>
    <body>
        <div class="timeline">
        <?php
            $dataset = json_decode(file_get_contents(__DIR__.'/timeline_data.json'), true);

            $toggle = true; 
            foreach ($dataset as $data){
                $toggle = !$toggle; 
                echo '<div class="container '.($toggle?'left':'right').'">';
                echo '  <div class="content">';
                echo '    <span class="subtitle">'.$data["date"].'</span>';
                echo '    <h2 class="title">'.$data["title"].'</h2>';
                if (isset($data["text"])){
                    echo '    <p>'.$data["text"].'</p>';
                }
                if (isset($data["links"]) && sizeof($data["links"])){
                    echo '<b>Weiterführende Links:</b>';
                    echo '<ul>';
                    foreach ($data["links"] as $link){
                        echo '<li><a href="'.$link["url"].'">'.$link["text"].'</a></li>';
                    }
                    echo '</ul>';
                }
                echo '  </div>';
                echo '</div>';
            }
        ?>
        </div>
    </body>
</html>