(function(){
    $.ajax({
        url: "/data/timeline_data.json",
        dataType: 'json',
        success: (data) => {
            data.forEach((e, i) => {
                $div = $("<div>").addClass("container").addClass((i%2 == 0)?"left":"right");

                var subtitle = [];
                subtitle.push(e.date);
                if (e.scope) subtitle.push(e.scope);
                if (e.type){
                    $div.addClass("type-" + e.type);
                    subtitle.push(e.type);
                } else {
                    $div.addClass("type-general");
                }

                $content = $("<div>").addClass("content");

                $subtitle = $("<span>").addClass("subtitle").html(subtitle.join(' / '));
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
                        $a = $("<a>").attr("href", link.url).attr("target", "_blank").text(link.text);
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