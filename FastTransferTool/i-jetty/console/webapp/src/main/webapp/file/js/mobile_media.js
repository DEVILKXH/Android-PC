var Media = 
{
        media: {
            "image" : {"internal" : null, "external":null},        
            "audio" : {"internal" : null, "external":null},
            "video" : {"internal" : null, "external":null}
        },

		page_size : 8,

		pages: {
			"image": {"internal": 0, "external":0},
			"audio": {"internal": 0, "external":0},
			"video": {"internal": 0, "external":0}
		},

		totals : {
			"image": {"internal": 0, "external":0},
			"audio": {"internal": 0, "external":0},
			"video": {"internal": 0, "external":0}
		},

		first: function (type, location)
		{
			Media.pages[type][location] = 0;
			Media.getMedia(type, location);
		},

        prev:  function (type, location)
        {
        	Media.pages[type][location] = Media.pages[type][location] - Media.page_size;
        	//Media.page_pos = Media.page_pos - Media.page_size;
        	Media.getMedia(type, location);
        },


        next:  function (type, location)
        {
        	Media.pages[type][location] = Media.pages[type][location] + Media.page_size;
        	Media.getMedia(type, location);
        },

        getMedia: function (type, location)
        {
            var uri =  "/console/rest/media/" + type + "/" + location;
            uri += "/?pgStart="+Media.pages[type][location]+"&pgSize="+Media.page_size;
            
            $.ajax({
                type: 'GET',
                url: uri,
                dataType: 'json',
                beforeSend: function(xhr)
                {
                    $("#" + type+"-"+location).empty();
                    $("#" + type+"-"+location).append ("Loading...");
                    return true;
                },
                success: function(response) 
                {

                    $(".index-loading").css("display","none");
                    Media.media[type][location] = response.media;
                    Media.totals[type][location] = response.total;
                    Media.renderMedia(type, location);
                },
                error: function(xhr, reason, exception) 
                { 
                    $("#" + type+"-"+location).empty();
                    $("#" + type+"-"+location).append("<p class='error'>"+reason+"</p>"+"<p class='error'>"+exception+"</p>");
                    $("#" + type+"-"+location).append ("<p class='error'>Failed to get " + type + "! Perhaps i-jetty is not running or there is a temporary network failure. Try doing a full page reload.</p>");
                }
            });
            return false; 
        },

        renderMedia: function (type, location)
        {
            var lmedia = Media.media[type][location];
            parent =  $("#mobile-classify-info");
            parent.empty ();
            
            html = "";

            
            // inner content
            for (var itemidx in lmedia)
            {
                var item = lmedia[itemidx];

                if (type == "image")
                {
                    html += "<div type='img' class='mdl-cell mdl-cell--2-col' index='0'><img class='classify-img' src='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id + "' alt='" +
                          item.title + "'/><input type='hidden' class='preview' value = '/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "'><input type='hidden' class='mobile-classify-download' value='/console/rest/searchfile/SearchFile?filename="+ item.displayname + "' /></div>";
                }
                else if (type == "audio")
                {
                    html += "<div type='audio' class='mdl-cell mdl-cell--4-col' index='0'><img class='classify-audio' src='/console/audio.png' alt='" + item.title + "'/>" +
                        "<input type='hidden'  class='preview' value ='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "'  /><input type='hidden' class='mobile-classify-download' value = '/console/rest/searchfile/SearchFile?filename="+ item.displayname + "' /><span >" + (item.title != null && item.title.length > 20 ? item.title.slice(0,20) : item.title);

                    if (item.artist != null || item.album != null)
                        html += "";

                    if (item.artist != null)
                    {
                        if (item.artist.length == 0)
                            html += "--Unknown Artist";
                        else
                            html += "--" + item.artist;
                    }

                    if (item.album != null)
                    {
                        if (item.album.length == 0)
                            html += "--Unknown Album";
                        else
                            html += "--" + item.album;
                    }

                    if (item.artist != null || item.album != null)
                        html += "";

                    html += "</span></div>";
                }
                else
                {
                    html += "<div type = 'audio'class='mdl-cell mdl-cell--4-col' index='0'><img class='classify-audio' src='/console/video.jpg' alt='" + item.title + "'/>" +
                        "<input type='hidden' class='preview' value ='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "' /><input type='hidden' class='mobile-classify-download' value = '/console/rest/searchfile/SearchFile?filename="+ item.displayname + "'' ><span >" + (item.title != null && item.title.length > 20 ? item.title.slice(0,20) : item.title);

                    if (item.artist != null || item.album != null)
                        html += "";

                    if (item.artist != null)
                    {
                        if (item.artist.length == 0)
                            html += "--Unknown Artist";
                        else
                            html += "--" + item.artist;
                    }

                    if (item.album != null)
                    {
                        if (item.album.length == 0)
                            html += "--Unknown video";
                        else
                            html += "--" + item.album;
                    }

                    if (item.artist != null || item.album != null)
                        html += "";

                    html += "</span></div>";
                }
            }
            
            html += "<div class='mdl-cell mdl-cell--4-col' index='1'><div class='index-page-list'>";
            
            var disabled = (Media.pages[type][location] > 0 && Media.media[type][location].length > 0)?"":"disabled";
            html += "<button class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' onclick='Media.first(\""+type+"\",\""+location+"\");'"+disabled+">First</button>";
            
            var disabled = (Media.pages[type][location] > 0 && Media.media[type][location].length > 0)?"":"disabled";
            html += "<button  class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' onclick='Media.prev(\""+type+"\",\""+location+"\");' "+disabled+">Prev</button>";


            disabled = (Media.totals[type][location] > (Media.pages[type][location] + Media.page_size))?"":"disabled";
            html += "<button  class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored' onclick='Media.next(\""+type+"\",\""+location+"\");' "+disabled+">Next</button>";
            
            html += "</div></div>";

            parent.append (html);
        },
        
        uploadComplete: function(json) {
            if (json.error != 0) {
                alert ("Failed to upload file to phone: " + json.msg);
                return;
            }
            
            setTimeout(this.finishUpload, 1000);
        },
        
        finishUpload: function() {
            Media.getAllMedia();
            
            $("#fileupload").attr("value", "")
        }
};



$(document).ready (function () {
}); 

function reloadMedia (type) {
   $("#mobile-classify-info").html("");
    $(".index-loading").css("display","block");
    Media.getMedia(type, "internal");
    Media.getMedia(type, "external");
    return false;
}



