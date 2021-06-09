(function(){
    $.ajax({
        url: "/data/timeline_data.json",
        dataType: 'json',
        success: (data) => {
            data.timeline.push({
                title: "Ausblick / Roadmap dieser Seite",
                text: "<ul><li>Externe Inhalte erst nach Consent einbinden</li><li>Liste vervollständigen</li></ul>"
            });
            data.timeline.forEach((e, i) => {
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

                if (e.embed && e.embed.length){
                    e.embed.forEach((embed, i) => {
                        if (embed.type == "vimeo"){
                            $iframe = $("<iframe>").attr("src", "https://player.vimeo.com/video/" + embed.id).attr("allowfullscreen","").attr("frameborder", "0").css("width","100%");
                            $content.append($iframe);
                        } else if (embed.type == "youtube"){
                            $iframe = $("<iframe>").attr("src", "https://www.youtube-nocookie.com/embed/" + embed.id).attr("allowfullscreen","").attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture").attr("frameborder", "0").css("width","100%");
                            $content.append($iframe);
                        } else if (embed.type == "ccc-media"){
                            $iframe = $("<iframe>").attr("src", "https://media.ccc.de/v/"+embed.id+"/oembed").attr("allowfullscreen","").attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture").attr("frameborder", "0").css("width","100%");
                            $content.append($iframe);
                        } else if (embed.type == "bundestag-webtv"){
                            // <script id="tv7519454" src="https://webtv.bundestag.de/player/macros/bttv/hls/player.js?content=7519454&phi=default"></script>
                            // wtf? embedding SCRIPT?
                            //$script = $("<script>").attr("id", "tv" + embed.id).attr("src", "https://webtv.bundestag.de/player/macros/bttv/hls/player.js?content="+embed.id+"&phi=default");
                            //$content.append($script);
                        } else if (embed.type == "fragdenstaat"){
                            $fragdenstaatnotice = $("<div>").text("TODO: Check if we're allowed to fetch status from fragdenstaat.de").css("color","darkred").css("font-weight","bold");
                            $content.append($fragdenstaatnotice);
                        }
                    });
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