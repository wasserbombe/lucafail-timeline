(function(){
    $.ajax({
        url: "/data/timeline_data.min.json",
        dataType: 'json',
        success: (data) => {
            var item = data.timeline[Math.floor(Math.random()*data.timeline.length)];
            console.log(item);

            $("#randomcontent").append("<b>"+item.date+'</b> &middot; <a href="/#'+item.id_readable+'"><i class="bi-link"></i></a>');
            $("#randomcontent").append("<h1>"+item.title+"</h1>");
            if (item.text){
                $("#randomcontent").append("<p>"+item.text+"</p>");
            }

            if (item.links && item.links.length > 0){
                $("#randomcontent").append($("<hr>"));  
                var $linklist = $("<ul>");
                item.links.forEach((link,i) => {
                    var $li = $("<li>");
                    if (link.url){
                        var $a = $("<a>").attr("href", link.url).attr("title", "Externer Link: "+link.text).attr("target", "_blank").text(link.text);
                        $li.append($a);
                    } else {
                        $li.html(link.text);
                    }
                    $linklist.append($li);
                });
                
                $("#randomcontent").append('<b>Weiterführende Links und Quellen:</b>').append($linklist);
            }

            $("#randomcontent").append($("<button>").html("Zum Originalbeitrag &raquo;").attr("type","button").addClass("btn btn-primary").on("click", () => {
                window.location.href = "/#"+item.id_readable;
            }));
            $("#randomcontent").append($("<br><br>"));
            $("#randomcontent").append($("<button>").html('<i class="bi bi-arrow-clockwise"></i> Zufälliger Beitrag').attr("type","button").addClass("btn btn-secondary").on("click", () => {
                window.location.reload();
            }));
        }
    });
})(); 