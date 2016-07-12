var Media = 
{
        media: {
            "image" : {"internal" : null, "external":null},        
            "audio" : {"internal" : null, "external":null},
            "video" : {"internal" : null, "external":null}
        },

		page_size : 12,

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
            parent =  $("#classify-list");
            parent.empty ();
            
            html = "<div class='mdl-grid'>";

            
            // inner content
            for (var itemidx in lmedia)
            {
                var item = lmedia[itemidx];

                if (type == "image")
                {
                    html += "<div class='mdl-cell mdl-cell--2-col classify-cell'><img class='index-image' src='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id + "' alt='" +
                          item.title + "'/><div target='_blank' class='index-option' ><a  class='index-review' target='_blank' href='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "'></a><a class='index-download' target='_blank' href = '/console/rest/searchfile/SearchFile?filename="+ item.displayname + "' ></a></div></div>";
                }
                else if (type == "audio")
                {
                    html += "<div class='mdl-cell mdl-cell--2-col classify-cell'><img class='index-image' src='/console/audio.png' alt='" + item.title + "'/><div class='index-option' >" +
                        "<a target='_blank' class='index-review' href ='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "'></a><a class='index-download' target='_blank' href = '/console/rest/searchfile/SearchFile?filename="+ item.displayname + "'' ></a></div><p class='index-info'>" + (item.title != null && item.title.length > 20 ? item.title.slice(0,20) : item.title);

                    if (item.artist != null || item.album != null)
                        html += "<span class='trackinfo'>";

                    if (item.artist != null)
                    {
                        if (item.artist.length == 0)
                            html += "<br />Unknown Artist";
                        else
                            html += "<br />" + item.artist;
                    }

                    if (item.album != null)
                    {
                        if (item.album.length == 0)
                            html += "<br />Unknown Album";
                        else
                            html += "<br />" + item.album;
                    }

                    if (item.artist != null || item.album != null)
                        html += "</span>";

                    html += "</p></div>";
                }
                else
                {
                    html += "<div class='mdl-cell mdl-cell--2-col classify-cell'><img class='index-image' src='/console/video.jpg' alt='" + item.title + "'/><div class='index-option' >" +
                        "<a target='_blank' class='index-review' href ='/console/browse/media/" + item.type + "/" + item.location + "/" + item.id +
                        "'></a><a class='index-download' target='_blank' href = '/console/rest/searchfile/SearchFile?filename="+ item.displayname + "'' ></a></div><p class='index-info'>" + (item.title != null && item.title.length > 20 ? item.title.slice(0,20) : item.title);

                    if (item.artist != null || item.album != null)
                        html += "<span class='trackinfo'>";

                    if (item.artist != null)
                    {
                        if (item.artist.length == 0)
                            html += "<br />Unknown Artist";
                        else
                            html += "<br />" + item.artist;
                    }

                    if (item.album != null)
                    {
                        if (item.album.length == 0)
                            html += "<br />Unknown video";
                        else
                            html += "<br />" + item.album;
                    }

                    if (item.artist != null || item.album != null)
                        html += "</span>";

                    html += "</p></div>";
                }
            }
            
            html += "<div class='mdl-cell mdl-cell--12-col'><ul class='index-page-list'>";
            
            var disabled = (Media.pages[type][location] > 0 && Media.media[type][location].length > 0)?"":"disabled";
            html += "<li onclick='Media.first(\""+type+"\",\""+location+"\");'"+disabled+">First Page</li>";
            
            var disabled = (Media.pages[type][location] > 0 && Media.media[type][location].length > 0)?"":"disabled";
            html += "<li  onclick='Media.prev(\""+type+"\",\""+location+"\");' "+disabled+">Prev Page</li>";


            disabled = (Media.totals[type][location] > (Media.pages[type][location] + Media.page_size))?"":"disabled";
            html += "<li  onclick='Media.next(\""+type+"\",\""+location+"\");' "+disabled+">Next Page</li>";
            
            html += "</li></div></div>";
            
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
    $("#classify-list").html("");
    Media.getMedia(type, "internal");
    Media.getMedia(type, "external");
    return false;
}



