(function(){
    $.ajax({
        url: "/data/timeline_data.json",
        dataType: 'json',
        success: (data) => {
            data.forEach((e, i) => {
                $div = $("<div>").addClass("container").addClass((i%2 == 0)?"left":"right");
                if (e.type){
                    $div.addClass("type-" + e.type);
                    e.date = e.date + " - " + e.type;
                } else {
                    $div.addClass("type-general");
                }

                $content = $("<div>").addClass("content");

                $subtitle = $("<span>").addClass("subtitle").html(e.date);
                $content.append($subtitle);

                $title = $("<h2>").addClass("title").html(e.title);
                $content.append($title);

                if (e.text){
                    $text = $("<div>").html(e.text);
                    $content.append($text);                    
                }

                if (e.links && e.links.length){
                    $linklist = $("<ul>");
                    e.links.forEach((link,i) => {
                        $li = $("<li>");
                        $a = $("<a>").attr("href", link.url).text(link.text);
                        $li.append($a);
                        $linklist.append($li);
                    });
                    
                    $linkarea = $("<div>").addClass("linkarea").html('<b>Weiterführende Links:</b>').append($linklist);

                    $content.append($linkarea);                    
                }

                $div.append($content);

                $(".timeline").append($div);
            });
        }
    });
})(); 