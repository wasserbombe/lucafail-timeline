(function(){
    // CONFIG
    var typeFriendlyNames = {
        "general": "Allgemein",
        "doc": "Dokument/Paper/Veröffentlichung",
        "fragdenstaat": "Anfrage via fragdenstaat.de",
        "incident": "Schwachstelle/Sicherheitsproblem",
        "news": "Veröffentlichungen in Magazinen, Newsportalen, ...",
        "event": "Veranstaltung",
        "broadcast": "TV- oder Radiosendung",
        "talk": "Präsentation auf Fachveranstaltung",
        "probleme": "Probleme im Betrieb: Benutzung / UX / Support",
        "podcast": "Podcast",
        "research": "Recherche",
        "doc-luca": "Veröffentlichung, direkt von Luca"
    };
    var typeBSIcon = {
        "general": "info-lg",
        "doc": "file-pdf",
        "fragdenstaat": "question-lg",
        "incident": "exclamation-lg",
        "news": "newspaper",
        "event": "calendar-event",
        "broadcast": "broadcast",
        "talk": "easel",
        "probleme": "emoji-frown",
        "podcast": "soundwave",
        "research": "zoom-in",
        "Kuriositäten": "stars",
        "doc-luca": "patch-check"
    };

    // /CONFIG
    var mymap = L.map('map_container', {
        fullscreenControl: true
    }).setView([51.3, 8.9], 5); 

    L.tileLayer('/osmtiles/tile.php?s={s}&z={z}&x={x}&y={y}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    var federalStatesDetails = {
        'DE-BW': {
            color: "#006400",
            updated: '2021-12-07',
            description: 'Seit Freitag, dem 15. Oktober 2021 ist ein Check-In in Baden-Württemberg auch mit der Corona-Warn-App möglich. Eine nicht-anonyme Datenerfassung - wie bspw. über die Luca-App - zur Kontaktnachverfolgung ist nicht mehr notwendig.',
            "sources": [{
                text: "netzpolitik.org",
                "url": "https://netzpolitik.org/2021/corona-warn-app-baden-wuerttemberg-erlaubt-datensparsames-einchecken/"
            },{
                text: "MSI BW: Ein weiterer Schritt zurück zur Normalität",
                url: "https://www.baden-wuerttemberg.de/de/service/alle-meldungen/meldung/pid/ein-weiterer-schritt-zurueck-zur-normalitaet/"
            }]
        },
        'DE-SH': {
            color: "#006400",
            updated: '2021-12-07',
            description: ''
        },
        'DE-TH': {
            color: "#ff8c00",
            updated: '2021-12-07',
            description: 'Das Land Thüringen empfiehlt in den Grundsätzen der Corona-Verordnung die Corona-Warn-App für die Kontakterfassung. In einzigen Bereichen ist aber eine Kontaktnachverfolgung vorgeschrieben (§3 Abs. 4) - hier ist eine anonymisierte Datenerfassung nicht möglich.',
            sources: [{
                url: "https://www.tmasgff.de/covid-19/verordnung",
                text: "Thüringer Verordnung zur Regelung infektionsschutzrechtlicher Maßnahmen zur Eindämmung des Coronavirus SARS-CoV-2"
            }]
        },
        'DE-HB': {
            color: "#006400",
            updated: '2021-12-24',
            description: 'In Bremen ist seit dem 24.12. die ausschließliche Nutzung der Corona-Warn-App möglich; Luca bzw. nicht-anonyme Kontaktdatenerfassung wird hier nicht mehr benötigt.<br>Zuvor: <s>In Bremen konnte die Corona-Warn-App für vier Tage zur Kontaktnachverfolgung genutzt werden, dann wurde sie aus der Verordnung gestrichen. Inzwischen iist die Situation unklar. Verordnung sehen die CWA nicht vor, auf Nachfrage wird aber mitgeteilt, dass eine ausschließliche Nutzung der Corona-Warn-App möglich sei - siehe <a href="https://github.com/wasserbombe/lucafail-timeline/issues/9">Github-Issue hierzu</a>.</s>',
            sources: [{
                text: "\u201cSenat beschließt Anpassung der Bremer Corona-Verordnung\u201d",
                url: "https://www.senatspressestelle.bremen.de/pressemitteilungen/senat-beschliesst-anpassung-der-bremer-corona-verordnung-373930?asl=bremen02.c.730.de"
            },{
                text: "Änderung der Corona-Verordnung vom 9.12.2021",
                url: "https://www.gesetzblatt.bremen.de/fastmedia/218/2021_12_09_GBl_Nr_0136_signed.pdf"
            },{
                text: "Neunundzwanzigste Verordnung zum Schutz vor Neuinfektionen mit dem Coronavirus SARS-CoV-2",
                url: "https://www.transparenz.bremen.de/metainformationen/neunundzwanzigste-verordnung-zum-schutz-vor-neuinfektionen-mit-dem-coronavirus-sars-cov-2-neunundzwanzigste-coronaverordnung-vom-28-september-2021-174654?asl=bremen203_tpgesetz.c.55340.de&template=20_gp_ifg_meta_detail_d"
            },{
                text: "Begründung der Sechsten Verordnung zur Änderung der Neunundzwanzigsten Verordnung zum Schutz vor Neuinfektionen mit dem Coronavirus SARS-CoV-2",
                url: "https://www.amtliche-bekanntmachungen.bremen.de/amtliche-bekanntmachungen/begruendung-der-sechsten-verordnung-zur-aenderung-der-neunundzwanzigsten-verordnung-zum-schutz-vor-neuinfektionen-mit-dem-coronavirus-sars-cov-2-16279?asl=bremen02.c.730.de"
            }]
        },
        'DE-SN': {
            color: "#006400",
            updated: '2021-11-19',
            description: 'In Sachsen ist eine anonyme Kontaktnachverfolgung über die Corona-Warn-App möglich un erwünscht: Veranstalter sollen vorrangig digitale Systeme - insbesondere die Corona-Warn-App - für die Kontaktnachverfolgung einsetzen. Dies gilt nur für in der Corona-Notfall-Verordnung genannten Bereiche.',
            sources: [{
                url: "https://www.coronavirus.sachsen.de/download/SaechsCoronaNotVO-2021-11-19.pdf",
                text: "Sächsische Corona-Notfall-Verordnung – SächsCoronaNotVO"
            }]
        },
        'DE-BB': {
            color: "#006400",
            updated: '2021-12-07',
            description: 'In Brandenburg ist ein Einsatz anonymer Kontaktnachverfolgung möglich, die Corona-Warn-App wird in der geltenden Verordnung (§5 - Kontaktnachweis) explizit genannt und von der Landesregierung emfohlen.',
            sources: [{
                text: "\u201cGesundheitsministerin Nonnemacher: Corona-Warn-App nutzen\u201d",
                url: "https://msgiv.brandenburg.de/msgiv/de/presse/pressemitteilungen/detail/~01-11-2020-corona-warn-app-nutzen"
            },{
                text: "\u201cHohe Corona-Fallzahlen: Priorisierung bei Nachverfolgung von Kontaktpersonen\u201d",
                url: "https://msgiv.brandenburg.de/msgiv/de/presse/pressemitteilungen/detail/~18-11-2021-priorisierung-bei-nachverfolgung-von-kontaktpersonen"
            },{
                text: "Zweite SARS-CoV-2-Eindämmungsverordnung - 2. SARS-CoV-2-EindV",
                url: "https://bravors.brandenburg.de/verordnungen/2__sars_cov_2_eindv#5"
            }]
        },
        'DE-HE': {
            color: "#006400",
            updated: '2021-12-14',
            description: 'In Hessen ist eine Kontaktdatenerfassung nur in Krankenhäusern, Kliniken, Pflegeeinrichtungen, Prostitutionsstätten und Clubs erforderlich. Ab dem 16.12.2021 entfällt die Pflicht zur Kontaktdatenerfassung, sofern eine Event-Registrierung - und somit eine anonyme Kontaktnachverfolgung - über die Corona-Warn-App erfolgt. Luca ist dann auch hier nicht mehr erforderlich.<br><blockquote>Die Kontaktdatenerfassung nach Satz 1 ist nicht erforderlich, wenn die Person, deren Daten zu erfassen wären, die in der Corona-Warn-App des Robert Koch-Institutes enthaltene QR-Code-Registrierung nutzt.</blockquote>',
            sources: [{
                text: "Coronavirus-Schutzverordnung - CoSchuV - vom 24. November 2021",
                url: "https://www.rv.hessenrecht.hessen.de/bshe/document/jlr-CoronaVVHE2021apP4"
            },{
                text: "Coronavirus-Schutzverordnung - CoSchuV - vom 24. November 2021, Stand 16.12.2021",
                url: "https://www.hessen.de/sites/hessen.hessen.de/files/2021-12/lf_coschuv_stand_16.12.21.pdf"
            },{
                text: "Infektionsschutzgesetz, §23",
                url: "https://www.gesetze-im-internet.de/ifsg/__23.html"
            }]
        },
        'DE-BY': {
            color: "#ff8c00",
            updated: '2021-11-04',
            description: 'In Bayern ist eine Kontaktdatenerfassung nur bei Veranstaltungen mit mehr als 1000 Personen in geschlossenen Räumen notwendig, sowie bei körpernahen Dienstleistungen und Gemeinschaftsunterkünften. Die breite Kontaktnachverfolgung durch die Gesundheitsämter wurde eingestellt.',
            sources: [{
                text: "\u201cGesundheitsämter stellen breite Kontaktnachverfolgung ein\u201d",
                url: "https://www.br.de/nachrichten/bayern/gesundheitsaemter-stellen-breite-corona-kontaktnachverfolgung-ein,SnoHOTl"
            },{
                text: "Fünfzehnte Bayerische Infektionsschutzmaßnahmenverordnung (15. BayIfSMV) vom 23. November 2021",
                url: "https://www.gesetze-bayern.de/Content/Document/BayIfSMV_15"
            }]
        },
        'DE-HH': {
            color: "#8b0000",
            updated: '2021-12-07',
            description: '<blockquote>In Hamburg müssen die Kontaktdaten weiter erfasst werden. Dazu muss soll vorrangig eine digitale Möglichkeit genutzt werden. Diese muss allerdings die Möglichkeit des Zugriffs durch die Gesundheitsämter ermöglichen. Die  CWA bietet einen solchen Datenübertrag nicht an. Sie dient der   individuellen Warnung und ist - konzeptionell so vorgesehen - kein   Beitrag zur Kontaktnachverfolgung.',
            sources: [{
                text: "Martin Helfrich (Pressesprecher) gegenüber dem CCC FR"
            }]
        },
        'DE-MV': {
            color: "#8b0000",
            updated: '2021-12-07',
            description: 'Die Corona-Verordnung in Mecklenburg-Vorpommern sieht eine Kontaktdatenerfassung vor, ein Einsatz anonymer Kontaktnachverfolgung wie bspw. über die Corona-Warn-App ist daher nicht möglich. Die Kontaktnachverfolgung selbst ist aber nur noch sehr schwer möglich. ',
            sources: [{
                text: "Corona-Jugend und Familie-Verordnung – Corona-JugFamVO M-V",
                url: "https://www.regierung-mv.de/static/Regierungsportal/Ministerium%20f%C3%BCr%20Soziales%2c%20Integration%20und%20Gleichstellung/Dateien/GVOBl.%20Nr.%2074%20v.%2026.11.2021.pdf"
            },{
                text: "\u201cStadt ändert ihr Kontaktpersonenmanagement / Konzentration auf gefährdete Gruppen und Gemeinschaftseinrichtungen\u201d",
                url: "https://www.schwerin.de/news/stadt-aendert-kontaktpersonenmanagement/"
            },{
                text: "Allgemeinverfügung zur Absonderung und Kontaktpersonenmanagement der Stadt Schwerin",
                url: "https://www.schwerin.de/export/sites/default/.galleries/Dokumente/Bekanntmachungen/Bekanntmachungen-2021/2021-10-27-AV-Absonderung-und-Kontaktpersonenmanagement.pdf"
            }]
        },
        'DE-BE': {
            color: "#8b0000",
            updated: '2021-12-07',
            description: 'In Berlin ist eine "Anwesenheitsdokumentation" (= Kontaktdatenerfassung) weiterhin erforderlich, wenngleich eine vollständige Kontaktnachverfolgung nicht sichergestellt werden kann.',
            sources: [{
                text: "\u201cErster Berliner Bezirk gibt Kontaktnachverfolgung auf\u201d",
                url: "https://www.morgenpost.de/bezirke/reinickendorf/article233808579/Erster-Berliner-Bezirk-gibt-Kontaktnachverfolgung-auf.html"
            },{
                text: "Dritte SARS-CoV-2-Infektionsschutzmaßnahmenverordnung",
                url: "https://www.berlin.de/corona/massnahmen/verordnung/"
            }]
        },
        'DE-RP': {
            color: "#006400",
            updated: '2021-12-22',
            description: '<blockquote>Die Kontakterfassung nach Satz 1 ist nicht erforderlich, wenn die Person, deren Daten zu erfassen sind, die in der Corona-Warn-App des Robert Koch-Instituts enthaltene QR-Code-Registrierung nutzt</blockquote>Damit ist eine anonyme Kontaktnachverfolgung in Rheinland-Pfalz möglich. Luca ist hier nicht erforderlich.',
            sources: [{
                url: "https://www.swr.de/swraktuell/rheinland-pfalz/ludwigshafen/pfaelzer-gesundheitsaemter-an-ueberlastungsgrenze-corona-kontaktverfolgung-100.html",
                text: "\u201cPfalz: Mehrere Gesundheitsämter stellen Kontaktnachverfolgung ein\u201d",
            },{
                url: "https://corona.rlp.de/fileadmin/corona/211203_29_CoBeLVO.pdf",
                text: "Neunundzwanzigste Corona-Bekämpfungsverordnung Rheinland-Pfalz"
            },{
                url: "https://corona.rlp.de/fileadmin/corona/Verordnungen/29._CoBeVo/211222_29_CoBeLVO_1AEndVO_konsolidierte_Fassung_001.pdf",
                text: "Neunundzwanzigste Corona-Bekämpfungsverordnung Rheinland-Pfalz"
            },{
                url: "https://corona.rlp.de/fileadmin/corona/Verordnungen/29._CoBeVo/211222_29_CoBeLVO_1_AEndVO_AEnderungsVO_001.pdf",
                text: "Änderung am 22.12 zu der Verordnung von 3.12."
            }]
        },
        'DE-NI': {
            color: "#006400",
            updated: '2022-01-15',
            description: 'Seit Samstag, dem 15. Januar 2022 ist ein Check-In in Niedersachsen auch mit der Corona-Warn-App möglich. Eine nicht-anonyme Datenerfassung - wie bspw. über die Luca-App - zur Kontaktnachverfolgung ist nicht mehr notwendig.',
            sources: [{
                url: "https://www.niedersachsen.de/Coronavirus/vorschriften-der-landesregierung-185856.html",
                text: "Niedersächsische Corona-Verordnung"
            }]
        },
        'DE-ST': {
            color: "#8b0000",
            updated: '2021-12-07',
            description: ''
        },
        'DE-NW': {
            description: 'Die  Coronaschutzverordnung in Nordrhein-Westfalen sieht derzeit keine verpflichtende Erhebung  von  Kontaktdaten (Rückverfolgbarkeit) vor. NRW nutzt IRIS Connect, eine offene Schnittstelle zur Datenerfassung für verschiedene Apps. Die Luca-App unterstützt diese Schnittstelle nicht.'
        },
        'DE-SL': {
            color: "#006400",
            updated: '2021-12-07',
            description: 'Die Corona-Verordnung im Saarland schreibt keine Kontaktdatenerfassung vor, die Luca-App wird aber beworben. Ein Einsatz einer zusätzlichen anonymen Kontaktnachverfolgung ist in jedem Fall sinnvoll.',
            sources: [{
                url: "https://www.saarland.de/DE/portale/corona/service/rechtsverordnung-massnahmen/_documents/verordnung_stand-21-12-01.html",
                text: "Corona-Verordnung Saarland"
            }]
        }
    };

    L.geoJSON(federalStates, {
        onEachFeature: function (feature, layer){
            var content = []; 
            content.push("<b>" + feature.properties.name + "</b>");
            if (typeof federalStatesDetails[feature.properties.id] !== "undefined") {
                var details = federalStatesDetails[feature.properties.id];
                if (details.description !== "") {
                    content.push(details.description);
                }
                if (details.sources && details.sources.length > 0){
                    content.push('<u>Quelle(n):</u> '); 
                    var $ul = $("<ul>");
                    details.sources.forEach((source) => {
                        if (source.url){
                            $ul.append($("<li>").html("<a href='" + source.url + "'>" + source.text + "</a>"));
                        } else {
                            $ul.append($("<li>").html(source.text));
                        }
                    });
                    content.push($ul.html()); 
                }
                if (details.updated){
                    content.push('<small>Stand: ' + details.updated + '</small>');
                }
            }
            content = content.join("<br>");
            layer.bindPopup(content);
        },
        style: function(feature) {
            console.log(feature); 
            if (typeof federalStatesDetails[feature.properties.id] !== "undefined") {
                var details = federalStatesDetails[feature.properties.id];
                if (details.color){
                    return {
                        color: details.color,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.5
                    };
                }
            }
        }
    }).addTo(mymap);

    var scrollToPanel = function (panel){
        if ($('[data-panel-id="'+panel+'"]').length){
            $('[data-panel-id="'+panel+'"]').get(0).scrollIntoView();
        } else if ($('[data-panel-name="'+panel+'"]').length){
            $('[data-panel-name="'+panel+'"]').get(0).scrollIntoView();
        } else {
            // try by date
            var splitPanel = panel.split("_"); 
            if (splitPanel.length >= 1){
                var dateToScrollTo = splitPanel[0];
                if ($('[data-date="'+dateToScrollTo+'"]').length){
                    $('[data-date="'+dateToScrollTo+'"]').get(0).scrollIntoView();
                }
            }
        }

        var url = new URL(location.href); 
        url.hash = "#"+panel; 

        window.history.replaceState(null, '', url); 
    };

    $(document).on("click", function (e) {
        var $link = $(e.target).closest("a"); 
        if ($link.length > 0){
            var href = $link.attr("href"); 
            var url = new URL(href, document.baseURI); 
            if (url.host == location.host){
                // internal link
                if (url.pathname == location.pathname && url.hash && url.hash.length > 1){
                    var panel = url.hash.substr(1); 
                    scrollToPanel(panel);
                }
            } else {
                // external link
            }
        }
    });


    var topics = []; 
    var scopes = []; 
    var fdsbuttonclickhandler = (e) => {
        var fdsclosest = $(e.target).closest("[data-fds-id]");
        if (fdsclosest.length){
            var fds = fdsclosest.data("fds-id");
            if (fds){
                window.open('https://fragdenstaat.de/a/' + fds, '_blank');
            }
        }
    };
    var glbuttonclickhandler = (e) => {
        var glclosest = $(e.target).closest("[data-gl-url]");
        if (glclosest.length){
            var url = glclosest.data("gl-url");
            if (url){
                window.open(url, '_blank');
            }
        }
    };

    /**
     * EMBEDDING of (external) content
     */
    var embedTypes = {
        "iframe": {
            // false = directly loaded / true = only loaded with consent
            needsConsent: true,
            // type could iframe or widget
            type: "iframe",
            // function called if consent given and content should be embedded
            embed: ($container, cfg) => {
                // true for successfull embed, false for fail
                if (typeof cfg.url != "undefined"){
                    var $iframe = $("<iframe>")
                                .attr("src", cfg.url)
                                .attr("frameborder", "0")
                                .css("width","100%")
                                .attr("scrolling","no");
                    if (cfg.height){
                        $iframe.css("height", cfg.height);
                    } else {
                        $iframe.css("min-height", "320px");
                    }
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "fragdenstaat": {
            needsConsent: false,
            type: "widget",
            provider: {
                name: "Open Knowledge Foundation Deutschland e.V.",
                address: "Singerstr. 109, 10179 Berlin",
                url: "https://fragdenstaat.de/",
                dataprivacynotice_url: "https://fragdenstaat.de/datenschutzerklaerung/"
            },
            embed: ($container, cfg) => {
                if (typeof cfg.id != "undefined"){
                    var $fragdenstaat = $("<div>").attr("data-fds-id", cfg.id);
                    
                    // TODO: Integrate embedFDS() here? 
                    embedFDS($fragdenstaat);

                    $container.append($fragdenstaat);
                    return true; 
                }
                return false; 
            }
        },
        "vimeo": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg && typeof cfg.id !== "undefined"){
                    var $iframe = $("<iframe>")
                                .attr("src", "https://player.vimeo.com/video/" + cfg.id)
                                .attr("allowfullscreen","")
                                .attr("frameborder", "0")
                                .css("width","100%")
                                .css("min-height", "320px");
                    $container.append($iframe);
                    return true;
                }
                return false; 
            }
        },
        "youtube": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg && typeof cfg.id !== "undefined"){
                    var ytsrc = "https://www.youtube-nocookie.com/embed/" + cfg.id;
                    if (cfg.startAt){
                        ytsrc += "?start=" + cfg.startAt; 
                    }
                    var $iframe = $("<iframe>")
                                    .attr("src", ytsrc)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width","100%")
                                    .css("min-height", "320px");
                    $container.append($iframe);
                    return true;
                }
                return false; 
            }
        },
        "tweet": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.url){
                    var $tweetdiv = $("<div>");
                    // TODO: we can do that better... (twttr.widgets.createTweet ?)
                    // https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
                    $tweetdiv.html("\u003Cblockquote data-dnt=\"true\" data-theme=\"dark\" data-align=\"center\" class=\"twitter-tweet\"\u003E\u003Ca href=\""+cfg.url+"\"\u003E\u003C\/a\u003E\u003C\/blockquote\u003E\n\u003Cscript async src=\"https:\/\/platform.twitter.com\/widgets.js\" charset=\"utf-8\"\u003E\u003C\/script\u003E");
                    $container.append($tweetdiv);
                    return true; 
                }
                return false; 
            }
        },
        "ardmediathek": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var url = "https://www.ardmediathek.de/embed/" + cfg.id; 
                    if (cfg.startTime && cfg.endTime){
                        url += "?startTime="+cfg.startTime+"&endTime="+cfg.endTime;
                    }
                    var $iframe = $("<iframe>")
                                    .attr("src", url)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width", "100%")
                                    .css("min-height", "320px");// .css("width","640").css("height","420");
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "tagesschau-video": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                // <iframe src="" width="512" height="288" allowfullscreen frameBorder="0" scrolling="no"></iframe>
                // <iframe src="https://www.tagesschau.de/multimedia/video/video-974031~player.html?start=15.88&ende=205.59" width="512" height="288" allowfullscreen frameBorder="0" scrolling="no"></iframe>
                if (cfg.id){
                    var url = "https://www.tagesschau.de/multimedia/video/video-"+cfg.id+"~player.html"; 
                    if (cfg.startTime && cfg.endTime){
                        url += "?start="+cfg.startTime+"&ende="+cfg.endTime;
                    }
                    var $iframe = $("<iframe>")
                                    .attr("src", url)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width", "100%")
                                    .css("min-height", "320px");// .css("width","640").css("height","420");
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "br-podcast": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                // <iframe src="https://www.br.de/mediathek/podcast/embed?episode=1846635" width="320px" height="120px"></iframe>
                if (cfg.episode){
                    var url = "https://www.br.de/mediathek/podcast/embed?episode="+cfg.episode; 
                    if (cfg.startTime && cfg.endTime){
                        url += "?start="+cfg.startTime+"&ende="+cfg.endTime;
                    }
                    var $iframe = $("<iframe>")
                                    .attr("src", url)
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width", "100%")
                                    .css("min-height", "120px");// .css("width","640").css("height","420");
                    $container.append($iframe);
                    return true; 
                }
                return false; 
            }
        },
        "ccc-media": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var $iframe = $("<iframe>")
                                    .attr("src", "https://media.ccc.de/v/"+cfg.id+"/oembed")
                                    .attr("allowfullscreen","")
                                    .attr("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture")
                                    .attr("frameborder", "0")
                                    .css("width","100%")
                                    .css("min-height", "320px");
                    $container.append($iframe);

                    return true; 
                }
                return false; 
            }
        },
        "podlove": {
            needsConsent: true,
            type: "iframe",
            embed: ($container, cfg) => {
                if (cfg.id){
                    var $iframe = $("<iframe>")
                                    .attr("src", "https://cdn.podlove.org/web-player/share.html?episode="+cfg.id)
                                    .attr("width","600")
                                    .attr("height","230")
                                    .attr("scrolling","no")
                                    .attr("frameborder", "0")
                                    .addClass("podlove");
                    $container.append($iframe);

                    return true; 
                }
                return false; 
            }
        },
        "gitlab": {
            // TODO: Check how to prevent external images from loading
            needsConsent: false,
            type: "widget",
            embed: ($container, cfg) => {
                if (cfg.project && cfg.issue){
                    var $gldiv = $("<div>").attr("data-gl-project-id", cfg.project).attr("data-gl-issue-id", cfg.issue);
                    embedGL($gldiv);
                    $container.append($gldiv);

                    return true; 
                }
                return false; 
            }
        }
    };

    var syncConsentToContent = () => {
        var consentGiven = $("#checkboxExternalContent").is(":checked");

        if (consentGiven){
            $("#checkboxRememberExternalSettings").prop("disabled", false);
        } else {
            $("#checkboxRememberExternalSettings").prop("checked", false);
            $("#checkboxRememberExternalSettings").prop("disabled", true);
        }

        console.log("syncConsentToContent", $(".embed[data-embed-cfg]").length);

        $(".embed[data-embed-cfg]").each((i, e) => {
            var $container = $(e); 
            var cfg = {};
            try {
                var rawcfg = $container.data("embed-cfg");
                if (typeof rawcfg == "object"){
                    cfg = rawcfg; 
                } else {
                    cfg = JSON.parse(rawcfg);
                }
                
            } catch (e){};

            var currentState = false;
            if ($container.data("embed-consent-state") && $container.data("embed-consent-state") == "true"){
                currentState = true; 
            }

            // lookup embed type configuration
            var embedcfg = null;
            if (cfg.type && typeof embedTypes[cfg.type] != "undefined"){
                embedcfg = embedTypes[cfg.type];
            }

            if (!embedcfg){
                console.log("No embed type '" + cfg.type + "' found!");
            } else {
                var consentForThisEmbed = consentGiven || !embedcfg.needsConsent; 

                if (currentState != consentGiven || !$container.data("embed-consent-state")){
                    $container.html(""); 

                    if (consentForThisEmbed){
                        // consent given, call callbacks
                        var res = false; 
                        if (typeof embedcfg.embed == "function"){
                            res = embedcfg.embed($container, cfg);
                        }

                        if (!res){
                            console.log("[ERROR] Container couldn't rendered/embedded.", embedcfg, cfg);
                        }

                        $container.attr("data-embed-consent-state", "true");
                    } else {
                        // no consent, hide content, show placeholder
                        var $embedPlaceholderInner = $("<div>").addClass("embed-placeholder").html('Um diesen Inhalt eines externen Anbieters ('+cfg.type+') zu laden, benötigen wir Ihr Einverständnis. Bitte beachten Sie dazu die <a href="#datenschutz">Datenschutzerklärung</a> unten.<br>');
                        var $btn_consent = $("<button>").attr("type", "button").addClass("btn btn-outline-secondary").text("Einverständnis erteilen").on("click", () => {
                            $('#checkboxExternalContent').click();
                        });
                        $embedPlaceholderInner.append($btn_consent);

                        $container.append($embedPlaceholderInner);
                        $container.attr("data-embed-consent-state", "false");
                    }
                }
            }
            
        });
    };
    $("#checkboxExternalContent").on("change", syncConsentToContent);
    $("#checkboxRememberExternalSettings").on("change", function (){
        var remember = $("#checkboxRememberExternalSettings").is(":checked");
        if (remember){
            localStorage.setItem("timeline_load_external_content", "true");
        } else {
            if (localStorage.getItem("timeline_load_external_content")){
                localStorage.removeItem("timeline_load_external_content");
            }
        }
    }); 

    var savedExternalContent = localStorage.getItem("timeline_load_external_content"); 
    if (savedExternalContent && savedExternalContent == "true"){
        $('#checkboxExternalContent').prop("checked", true);
        syncConsentToContent(); 
        $('#checkboxRememberExternalSettings').prop("checked", true);
    }

    var embedFDS = ($fdswidget) => {
        $fdswidget.addClass("fds-widget").addClass("embed-widget");
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

                    if (data.costs){
                        $fdscontent.append($("<span>").addClass("fds-content-title").html("Kosten:<br>"));
                        $fdscontent.append($("<span>").text(data.costs + " €"));
                    }

                    if (data.summary){
                        $fdscontent.append($("<span>").addClass("fds-content-title").html("Zusammenfassung / Fazit:<br>"));
                        $fdscontent.append($("<span>").text(data.summary));
                    }

                    $fdscontent.append($("<span>").addClass("fds-content-title").html("Inhalt:<br>"));
                    // TODO: Find a better way than throwing unchecked HTML into the page...
                    $fdscontent.append($("<span>").html(data.description));

                    var $fdscredit = $("<div>").addClass("fds-credit");
                    var $tr = $("<tr>");
                    var $td = $("<td>").append($("<img>").attr("src","/assets/fds/banner.svg").css("max-height","50px").css("margin-right","10px"));
                    $tr.append($td);

                    var $td = $("<td>");
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
    var embedGL = ($glwidget) => {
        $glwidget.addClass("gl-widget").addClass("embed-widget");
        $.ajax({
            url: "/api/gitlab.php",
            data: { project: $glwidget.data("gl-project-id"), issue: $glwidget.data("gl-issue-id") },
            dataType: 'json',
            success: (data) => {
                if (data.data){
                    data = data.data;
                    var $gltitle = $("<div>").addClass("gl-title").text("Gitlab: " + data.title);
                    $glwidget.append($gltitle);

                    var $glcontent = $("<div>").addClass("gl-content");

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Author:<br>"));
                    $glcontent.append($("<span>").text(data.author.name));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("State:<br>"));
                    $glcontent.append($("<span>").text(data.state));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Letztes Update:<br>"));
                    $glcontent.append($("<span>").text(data.updated));

                    $glcontent.append($("<span>").addClass("gl-content-title").html("Inhalt:<br>"));

                    // TODO: Find a better way than throwing unchecked HTML into the page...
                    var md = window.markdownit({
                        html: true, 
                        breaks: true, 
                        linkify: true
                    });
                    var md_rendered = md.render(data.description);
                    if (md_rendered){
                        var $rendered = $(md_rendered);
                        $rendered.find("img").each((i, e) => {
                            if ($(e).attr("src").match(/^\/uploads\/.+/i)){
                                $(e).attr("src", data.url.split("/").slice(0,5).join("/") + $(e).attr("src"));
                            }
                        });
                        $rendered.find("a").each((i, e) => {
                            $(e).attr("target", "_blank"); 
                        });
                        
                        $glcontent.append($("<span>").addClass("gl-content-gltext").html($rendered));
                    } else {
                        $glcontent.append($("<span>").html(data.description));
                    }

                    $glwidget.attr("data-gl-url", data.url);

                    var $glcredit = $("<div>").addClass("gl-credit");
                    var $tr = $("<tr>");

                    var $td = $("<td>").append($("<img>").attr("src","/assets/gitlab-logo-gray-stacked-rgb.svg").css("width", "100%").css("max-height","65px").css("margin-right","10px"));
                    $tr.append($td);

                    var $td = $("<td>");
                    $td.append($("<span>").html("Die in diesem Widget angezeigten Daten werden von <a href=\"https://gitlab.com\" target=\"_blank\">gitlab.com</a> abgerufen."));
                    $td.append($("<button>").text("Zur Original-Anfrage auf gitlab.com »").on("click", glbuttonclickhandler));
                    $tr.append($td);

                    $glcredit.append($("<table>").append($tr));
                    $glcontent.append($glcredit);

                    $glwidget.append($glcontent);
                }
            }
        });
    }
    $.ajax({
        url: "/data/timeline_data.min.json",
        dataType: 'json',
        success: (data) => {
            data.timeline = data.timeline.reverse(); 

            var lastYearAndMonth = null; 
            var statisticsByMonthAndCategory = {};
            data.timeline.forEach((e, i) => {
                var subtitle = [];
                if (e.date){
                    subtitle.push('<i class="bi-calendar-event"></i> ' + e.date);

                    var dateMatch = e.date.match(/^([0-9]{2})\.([0-9]{2})\.([0-9]{4})$/i);

                    if (dateMatch){
                        var yearMonth = dateMatch[3] + '-' + dateMatch[2];
                        e.dateYYMMDD = dateMatch[3] + '-' + dateMatch[2] + '-' + dateMatch[1]
                        if (yearMonth != lastYearAndMonth){
                            // new month!
                            var $monthSep = $("<div>").html("<h2>" + yearMonth + "</h2>").addClass("month-separator").attr("id", yearMonth);

                            $(".timeline").append($monthSep);
                            
                            lastYearAndMonth = yearMonth; 
                        }
                    }
                }
                
                var $timelineli = $("<li>").addClass((i%2 == 0)?"timeline-inverted":"");

                var icon = "info-lg";
                if (typeBSIcon[e.type]){
                    icon = typeBSIcon[e.type]; 
                }
                var $badge = $("<div>").addClass("timeline-badge").html('<i class="bi-'+icon+'"></i>');
                $timelineli.append($badge);

                e.tags = e.tags || []; 
                if (e.scope) {
                    subtitle.push('<i class="bi-geo-alt"></i> ' + e.scope);
                    e.tags.push(e.scope);

                    if (scopes.indexOf(e.scope) == -1){
                        $("#filterScopes").append($("<option>").text(e.scope).attr("value", e.scope).prop("selected", true));
                        scopes.push(e.scope);
                    }
                }
                e.type = e.type || "general";
                $timelineli.addClass("type-" + e.type);
                $timelineli.attr("data-type", e.type);
                $timelineli.attr("data-date", e.dateYYMMDD ? e.dateYYMMDD : "");
                
                // add panel ID
                if (e.id_readable){
                    $timelineli.attr("data-panel-name", e.id_readable);
                }
                if (e.id){
                    $timelineli.attr("data-panel-id", e.id);
                }

                var topic = e.type; 
                if (typeof typeFriendlyNames[e.type] !== "undefined"){
                    topic = typeFriendlyNames[e.type];
                }
                subtitle.push(topic);
                e.tags.push(e.type);
                
                if (topics.indexOf(e.type) == -1){
                    $("#filterTopics").append($("<option>").text(topic).attr("value", e.type).prop("selected", true));
                    topics.push(e.type); 
                }

                if (typeof statisticsByMonthAndCategory[lastYearAndMonth] == "undefined") statisticsByMonthAndCategory[lastYearAndMonth] = {};
                if (typeof statisticsByMonthAndCategory[lastYearAndMonth][e.type] == "undefined"){
                    statisticsByMonthAndCategory[lastYearAndMonth][e.type] = 1;
                } else {
                    statisticsByMonthAndCategory[lastYearAndMonth][e.type]++;
                }

                var $panel = $("<div>").addClass("timeline-panel");

                var $heading = $("<div>").addClass("timeline-heading");

                // subtitle
                if (typeof e.verified !== "undefined"){
                    if (!e.verified){
                        subtitle.push('<small><span style="color: darkred;"><i class="bi-exclamation-triangle-fill" title="Info (noch) nicht verifiziert"></i></span></small>');
                    } else {
                        subtitle.push('<small><span style="color: darkgreen;"><i class="bi-check-circle-fill" title="Info verifiziert."></i></span></small>');
                    }
                }
                // add panel link to subtitle
                if (e.id_readable){
                    subtitle.push('<a href="#'+e.id_readable+'"><i class="bi-link"></i></a>')
                    subtitle.push(e.id);
                }

                if (typeof e.viaDPAInfocom != "undefined" && e.viaDPAInfocom){
                    e.tags.push("dpa-meldung");
                    if (e.viaDPAInfocomID){
                        subtitle.push('<nobr><span class="tl-badge tl-badge-dpa"><i class="bi-megaphone"></i> '+e.viaDPAInfocomID+'</span></nobr>');
                    } else {
                        subtitle.push('<nobr><span class="tl-badge tl-badge-dpa"><i class="bi-megaphone"></i> DPA-Boost</span></nobr>');
                    }
                }
                
                var $small = $("<small>").addClass("text-muted").html(subtitle.join(' / '));
                var $p = $("<p>").append($small);
                $heading.append($p);

                // title
                var $title = $("<h4>").addClass("title").html(e.title);
                $heading.append($title);
                $panel.append($heading);

                var $content = $("<div>").addClass("timeline-body");

                if (typeof e.verified !== "undefined"){
                    if (!e.verified){
                        $content.append($("<span>").html('<small><span style="color: darkred;"><i class="bi-exclamation-triangle-fill"></i> Information noch nicht verifiziert. Hilf uns, indem Du weitere Quellen findest.</span></small>'));
                    }
                }

                if (e.text){
                    var $text = $("<div>").html(e.text);
                    $content.append($text);                    
                }

                // figures
                if (e.figures && e.figures.length > 0){
                    e.figures.forEach((figure, i) => {
                        if (figure.type == "table"){
                            var $tablediv = $("<div>").addClass("table-responsive");
                            var $table = $("<table>").addClass("table");
                            if (figure.data){
                                if (figure.data.header && figure.data.header.length > 0){
                                    var $thead = $("<thead>");
                                    var $tr = $("<tr>");
                                    figure.data.header.forEach((header, h) => {
                                        var $th = $("<th>");
                                        $th.text(header);
                                        $tr.append($th); 
                                    })
                                    $thead.append($tr); 
                                    $table.append($thead);
                                }
                                if (figure.data.rows && figure.data.rows.length > 0){
                                    var $tbody = $("<tbody>");
                                    figure.data.rows.forEach((row, r) => {
                                        var $tr = $("<tr>");
                                        row.forEach((cell, c) => {
                                            var $td = $("<td>");
                                            $td.html(cell);
                                            $tr.append($td); 
                                        });
                                        $tbody.append($tr); 
                                    })
                                    $table.append($tbody);
                                }
                            }
                            $tablediv.append($table);
                            $content.append($tablediv);
                        }
                    });
                }

                // new consent-based embed
                if (e.embed && e.embed.length > 0){
                    e.embed.forEach((embed, i) => {
                        var $embedPlaceholderDiv = $("<div>").addClass("embed").attr("data-embed-cfg", JSON.stringify(embed));
                        $content.append($embedPlaceholderDiv);
                    });
                }

                // linklist
                if (e.links && e.links.length > 0){
                    $content.append($("<hr>"));  
                    var $linklist = $("<ul>");
                    e.links.forEach((link,i) => {
                        var $li = $("<li>");
                        if (link.url){
                            var $a = $("<a>").attr("href", link.url).attr("title", "Externer Link: "+link.text).attr("target", "_blank").text(link.text);
                            $li.append($a);
                        } else {
                            $li.html(link.text);
                        }
                        $linklist.append($li);
                    });
                    
                    var $linkarea = $("<div>").addClass("linkarea").html('<b>Weiterführende Links / Quellen:</b>').append($linklist);

                    $content.append($linkarea);                    
                }

                // references
                e.references = e.references || []; 

                // find "incoming" references
                data.timeline.forEach((tlelem, ti) => {
                    if (tlelem.references){
                        tlelem.references.forEach((reference, ri) => {
                            if (reference.id == e.id){
                                e.references.push({ id: tlelem.id});
                            }
                        });
                    }
                });

                if (e.references.length > 0){
                    $content.append($("<hr>"));  
                    var $referencelist = $("<ul>");
                    e.references.forEach((reference, i) => {
                        if (reference.id){
                            for (var ti = 0; ti < data.timeline.length; ti++){
                                var tlelem = data.timeline[ti]; 
                                if (tlelem.id == reference.id){
                                    var $li = $("<li>");
                                    var $a = $("<a>").attr("href", "#"+tlelem.id_readable).text(tlelem.title);
                                    $li.append($a);
                                    $referencelist.append($li); 
                                    break; 
                                }
                            }
                        }
                    });

                    var $referencearea = $("<div>").addClass("referencearea").html('<b>Siehe auch:</b>').append($referencelist);
                    $content.append($referencearea);
                }

                // tag list
                $content.append("<hr>");
                var $tags = $("<div>"); 
                e.tags.forEach((e, i) => {
                    var $tag = $("<span>").addClass("badge bg-secondary").text(e).attr("data-tag", e.toLowerCase());
                    $tags.append($tag);
                });
                $content.append($tags);

                $panel.append($content);

                $timelineli.append($panel);

                // add map
                if (e.geo && e.geo.position){
                    var popup_text = []; 
                    popup_text.push('<small style="color: grey;">' + subtitle.join(' / ') + '</small>')
                    popup_text.push('<b>' + e.title + '</b>')
                    if (e.text){
                        popup_text.push(e.text); 
                    }
                    if (e.links && e.links.length > 0){
                        popup_text.push('<small>'+$linklist.html()+'</small>');
                    }
                    L.marker([e.geo.position.lat, e.geo.position.lng]).addTo(mymap).bindPopup(popup_text.join('<br>'));
                }

                $(".timeline").append($timelineli);
            });

            syncConsentToContent();

            // scroll if query param present
            // TODO: Trigger if page content was loaded / removing interval...
            var scrollIntCounter = 0; 
            var scrollInt = window.setInterval(function (){
                var url = new URL(location.href); 
                if (url && url.searchParams){
                    if (url.hash && url.hash.length > 1) {
                        scrollToPanel(url.hash.substr(1)); 
                    } else if (url.searchParams.get("panel")){
                        scrollToPanel(url.searchParams.get("panel"));
                    } else if (url.searchParams.get("date")){
                        scrollToPanel(url.searchParams.get("date"));
                    }
                }
                if (scrollIntCounter++ > 10){
                    window.clearInterval(scrollInt);
                }
            }, 200);

            $(document).ready(function() {
                // scroll to referring article if possible
                if (document.referrer){
                    var ref = new URL(document.referrer);
                    var found = false; 
                    for (var i = 0; i < data.timeline.length; i++){
                        var item = data.timeline[i];
                        if (!found && item.links && item.links.length > 0){
                            item.links.forEach((link, i) => {
                                try {
                                    var lurl = new URL(link.url);
                                    if (lurl.host.toLowerCase() == ref.host.toLowerCase()){
                                        scrollToPanel(item.id_readable);
                                        found = true; 
                                    }
                                } catch (e){}
                            });
                        }
                        if (found){
                            break; 
                        }
                    }
                }

                $('#filterTopics').multiselect({
                    allSelectedText: "Alle Themen",
                    nSelectedText: " Themen ausgewählt",
                    includeSelectAllOption: true,
                    selectAllText: 'Alle Themen',
                    nonSelectedText: 'Keine Themen gewählt',
                    buttonWidth: '200px',
                    onChange: function(option, checked) {
                        var selectedOptions = $('#filterTopics option:selected');
                        var selectedTopics = []; 
                        selectedOptions.each((i, elem) => {
                            selectedTopics.push(elem.value); 
                        });

                        $("ul.timeline li").each((i, elem) => {
                            var $li = $(elem); 
                            if (selectedTopics.indexOf($li.attr("data-type")) == -1){
                                $li.hide(); 
                            } else {
                                $li.show(); 
                            }
                        }); 
                    }
                });
                $('#filterScopes').multiselect({
                    allSelectedText: "Alle Bereiche",
                    nSelectedText: " Bereiche ausgewählt",
                    includeSelectAllOption: true,
                    selectAllText: 'Alle Bereiche',
                    nonSelectedText: 'Kein Bereich gewählt',
                    buttonWidth: '200px',
                    onChange: function(option, checked) {
                    }
                });
            });

            var series = {"name": "test", data: []}; 
            var series = {}; 
            for (var m in statisticsByMonthAndCategory){
                if (m && statisticsByMonthAndCategory.hasOwnProperty(m)){
                    var ts = new Date(m).getTime(); 
                    for (var c in statisticsByMonthAndCategory[m]){
                        if (c && statisticsByMonthAndCategory[m].hasOwnProperty(c)){
                            // series.data.push([ts, statisticsByMonthAndCategory[m][c]]);
                            if (typeof series[c] == "undefined") series[c] = []; 
                            series[c].push([ts, statisticsByMonthAndCategory[m][c]]);
                        }
                    }
                }
            }
            var series_new = []; 
            for (var c in series){
                if (c && series.hasOwnProperty(c)){
                    var name = c; 
                    if (typeof typeFriendlyNames[name] != "undefined"){
                        name = typeFriendlyNames[name]; 
                    }
                    series_new.push({ name: name, data: series[c] });
                }
            }
            
            Highcharts.chart('stats_container_month_category', {
                chart: {
                    type: 'column'
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Beiträge in dieser Timeline - pro Monat'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Beiträge'
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {},
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: series_new
            });

            $("#stats_total_count").html("Diese Timeline enthält aktuell <b>"+data.timeline.length+" Beiträge</b>, verteilt auf folgende Monate und Themen. ");
            var countLinks = countEmbeds = 0; 
            data.timeline.forEach((e,i) => {
                if (e.links && e.links.length > 0){
                    countLinks += e.links.length; 
                }
                if (e.embed && e.embed.length > 0){
                    countEmbeds += e.embed.length;
                }
            });
            $("#stats_total_count").append("Die Beiträge enthalten insgesamt <b>"+(countLinks+countEmbeds)+" Links und Quellen</b> bzw. <b>"+countEmbeds+" Einbindungen</b> von externen Webseiten (soziale Netzwerke, Gitlab, Frag den Staat, etc.). ");
        }
    });
})(); 
