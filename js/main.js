(function(){
    var fdsbuttonclickhandler = (e) => {
        var fdsclosest = $(e.target).closest("[data-fds-id]");
        if (fdsclosest.length){
            var fds = fdsclosest.data("fds-id");
            if (fds){
                window.open('https://fragdenstaat.de/a/' + fds, '_blank');
            }
        }
    };

    var embedFDS = ($fdswidget) => {
        $fdswidget.addClass("fds-widget");
        $.ajax({
            url: "/api/fds.php",
            data: { id: $fdswidget.data("fds-id") },
            dataType: 'json',
            success: (data) => {
                if (data.data){
                    data = data.data;
                    var $fdstitle = $("<div>").addClass("fds-title").text(data.title);
                    $fdswidget.append($fdstitle);

                    var $fdscontent = $("<div>").addClass("fds-content");

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Anfrage an:<br>"));
                    $fdscontent.append($("<span>").text(data.recipient));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Status:<br>"));
                    $fdscontent.append($("<span>").addClass("fds-status-badge").addClass("fds-status-" + data.status).text(data.status));
                    $fdscontent.append($("<span>").text(" - " + data.resolution + " (" + data.messages_count + " Nachrichten)"));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Letzte Nachricht:<br>"));
                    $fdscontent.append($("<span>").text(data.last_message));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Kosten:<br>"));
                    $fdscontent.append($("<span>").text(data.costs + " €"));

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Inhalt:<br>"));
                    // TODO: Find a better way than throwing unchecked HTML into the page...
                    $fdscontent.append($("<span>").html(data.description));

                    $fdscredit = $("<div>").addClass("fds-credit");
                    $tr = $("<tr>");
                    $td = $("<td>").append($("<img>").attr("src","/assets/fds/banner.svg").css("max-height","50px").css("margin-right","10px"));
                    $tr.append($td);

                    $td = $("<td>");
                    $td.append($("<span>").html("Die in diesem Widget angezeigten Daten werden von <a href=\"https://fragdenstaat.de\" target=\"_blank\">fragdenstaat.de</a> abgerufen."));
                    $td.append($("<button>").text("Zur Original-Anfrage auf fragdenstaat.de »").on("click", fdsbuttonclickhandler));
                    $tr.append($td);

                    $fdscredit.append($("<table>").append($tr));
                    $fdscontent.append($fdscredit);

                    $fdswidget.append($fdscontent);
                }
            }
        });
    }
    $.ajax({
        url: "/data/timeline_data.json",
        dataType: 'json',
        success: (data) => {
            data.timeline.push({
                title: "Ausblick / Roadmap dieser Seite",
                text: "Siehe <a href=\"https://github.com/wasserbombe/lucafail-timeline\" target=\"_blank\">https://github.com/wasserbombe/lucafail-timeline</a>"
            });
            data.timeline.forEach((e, i) => {
                $div = $("<div>").addClass("container").addClass((i%2 == 0)?"left":"right");

                e.tags = e.tags || []; 
                var subtitle = [];
                subtitle.push(e.date);
                if (e.scope) subtitle.push(e.scope);
                if (e.type){
                    $div.addClass("type-" + e.type);
                    subtitle.push(e.type);
                    e.tags.push(e.type);
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
                            $iframe = $("<iframe>").attr("src", "https://player.vimeo.com/video/" + embed.id).attr("allowfullscreen","").attr("frameborder", "0").css("width","100%").css("min-height", "320px");
                            $content.append($iframe);
                        } else if (embed.type == "youtube"){
                            $iframe = $("<iframe>").attr("src", "https://www.youtube-nocookie.com/embed/" + embed.id).attr("allowfullscreen","").attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture").attr("frameborder", "0").css("width","100%").css("min-height", "320px");
                            $content.append($iframe);
                        } else if (embed.type == "ccc-media"){
                            $iframe = $("<iframe>").attr("src", "https://media.ccc.de/v/"+embed.id+"/oembed").attr("allowfullscreen","").attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture").attr("frameborder", "0").css("width","100%").css("min-height", "320px");
                            $content.append($iframe);
                        } else if (embed.type == "bundestag-webtv"){
                            // <script id="tv7519454" src="https://webtv.bundestag.de/player/macros/bttv/hls/player.js?content=7519454&phi=default"></script>
                            // wtf? embedding SCRIPT?
                            //$script = $("<script>").attr("id", "tv" + embed.id).attr("src", "https://webtv.bundestag.de/player/macros/bttv/hls/player.js?content="+embed.id+"&phi=default");
                            //$content.append($script);
                        } else if (embed.type == "podlove"){
                            $iframe = $("<iframe>").attr("src", "https://cdn.podlove.org/web-player/share.html?episode="+embed.id).attr("width","600").attr("height","230").attr("scrolling","no").attr("frameborder", "0");
                            $iframe.addClass("podlove");
                            $content.append($iframe);
                        } else if (embed.type == "fragdenstaat"){
                            $fragdenstaat = $("<div>").attr("data-fds-id", embed.id);
                            embedFDS($fragdenstaat);
                            $content.append($fragdenstaat);
                        } else if (embed.type == "ardmediathek"){
                            // <iframe src="https://www.ardmediathek.de/embed/Y3JpZDovL2Rhc2Vyc3RlLmRlL3BsdXNtaW51cy9jM2Y1ODI1MS0xZjQ1LTQ1NDYtOTRiZi0zNTk0ZjhiMzk0NGU?startTime=1127.75&endTime=1680.35" width="640" height="420" allowfullscreen frameBorder="0" scrolling="no"></iframe>
                            var url = "https://www.ardmediathek.de/embed/" + embed.id; 
                            if (embed.startTime && embed.endTime){
                                url += "?startTime="+embed.startTime+"&endTime="+embed.endTime;
                            }
                            $iframe = $("<iframe>").attr("src", url).attr("allowfullscreen","").attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture").attr("frameborder", "0").css("width", "100%").css("min-height", "320px");// .css("width","640").css("height","420");
                            $content.append($iframe);
                        } else if (embed.type == "tweet" && embed.url){
                            var $tweetdiv = $("<div>");
                            // TODO: we can do that better... (twttr.widgets.createTweet ?)
                            // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
                            $tweetdiv.html("\u003Cblockquote data-dnt=\"true\" data-theme=\"dark\" data-align=\"center\" class=\"twitter-tweet\"\u003E\u003Ca href=\""+embed.url+"\"\u003E\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E");
                            $content.append($tweetdiv);
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

                $tags = $("<div>"); 
                e.tags.forEach((e, i) => {
                    $tag = $("<span>").addClass("tag").text(e).attr("data-tag", e.toLowerCase());
                    $tags.append($tag);
                });
                $content.append($tags);

                $div.append($content);

                $(".timeline").append($div);
            });
        }
    });
})(); 