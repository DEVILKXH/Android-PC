$(function(){

	var folderPath = "all";
	init();

	//初始化
	function init(){
		$("#file-op-contain").animate({bottom: "-=" + $("#file-op-contain").height()});
		doDirectory();
	}

	//分类查看
	/*****************左边导航事件******************************************/
	$(".mobile-classify").click(function(){
		var $active = $(this);
		if($active.attr("type") == "all"){
			$("#mobile-all").css("display","block");
			$("#mobile-classify").css("display","none");
		}else{
			$("#mobile-all").css("display","none");
			$("#mobile-classify").css("display","block");
		}
	});

	$("#mobile-classify-info").bind('click',function (ev) {
		var oEvent = event || ev;
		var obj = oEvent.target;
		var fa = getFatherElement(this,obj);
		if($(fa).attr("index") == "0"){
			$(".classify-view").css("display","block");
			var view = $(fa).find(".preview").eq(0).val();
			var download = $(fa).find(".mobile-classify-download").eq(0).val();
			$(".classify-view").find(".download").attr("href",download);
			if($(fa).attr("type") == "img"){
				$(".audio").css("display","none");
				$(".view-img").attr("src",view);
			}else{
				$(".view-img").css("display","none");
				$(".audio").eq(0).find("source").eq(0).attr("src",view);
			}

			$(".view-close").click(function(){
				$(".classify-view").css("display","none");
			});
		}
	});


	//文件夹点击事件
	$("#mobile-folder-cell").bind("click",function(ev){
		var oEvent = ev || event;
		var obj = oEvent.target;
		var fa = getFatherElement(this, obj);

		if(fa.className == "mdl-cell mdl-cell--4-col mobile-folder-info mobile-folder-false"){

		}else{
			var op =$(fa).find(".mobile-folder-operation")[0];
			if(op.contains(obj)){
				var file = getFatherElement(this,obj);
				$(file).addClass("folder-active");
				FolderOp();
				return ;
			}
			var folder = getFatherElement(this, obj);
			var filename = $(folder).find(".mobile-folder-name").eq(0).text();

			var  $menuRoot = $("#page-menu-header");
			var $span2 = $("<span class='menu-next'>></span>");
			var $span = $("<span class='menu-folder' index='"+ $(".menu-folder").length +"'>"+ filename +"</span>");
			$menuRoot.append($span2);
			$menuRoot.append($span);
			$(".index-loading").css("display","block");
			$("#mobile-folder-title").text(filename);


			doDirectory();
		}


	});

	// 文件点击导航
	$("#mobile-file-cell").bind("click",function(ev){
		var oEvent = ev || event;
		var obj = oEvent.target;
		var fa = getFatherElement(this, obj);
		var op =$(fa).find(".mobile-folder-operation")[0];
		if(op.contains(obj)){
			var file = getFatherElement(this,obj);
			$(file).addClass("file-active");
			FolderOp();
		}
	});


	//右边导航
	function FolderOp(){
		$("#file-op").css("display","block");
		$("#file-op-contain").animate({bottom: "+=" + $("#file-op-contain").height()});
	}

	//
	$("#file-op").click(function(){
		$("#file-op-contain").animate({bottom: "-=" + $("#file-op-contain").height()});
		$(this).css("display","none");
		$(".mobile-folder-info").removeClass("folder-active");
		$(".mobile-file-info").removeClass("file-active");
	});

	//文件操作
	$(".mobile-folder-op").click(function(){
		var op = $(this).attr("type");
		var path = getPath();
		var $active;
		var type ;
		if($(".folder-active").length > 0){
			$active = $(".folder-active").eq(0);
			type = "folder";
		}else{
			$active = $(".file-active").eq(0);
			type = "file";
		}
		var filename = $active.find(".mobile-folder-name").eq(0).text();

		if(op == "download"){
			if(type == "folder"){
				window.location.href = "/console/rest/filezip/FileZip?filepath="+ path +"&filename="+ filename +"&type=2";
			}else{
				window.location.href = "/console/rest/filedownload/FileDownload?filepath="+ path +"&filename="+ filename +"&type=1";
			}
		}else if(op == "rename"){
			var newFilename = window.prompt("请输入文件名",filename);
			if(newFilename != "" && newFilename != null && newFilename != "null"){
				$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {oldfile: filename,newfile: newFilename,path: path,type: "renameFile"},
					success: function(){
						doDirectory();
					}
				});
			}
		}else if(op == "delete"){
			var flag = window.confirm("将删除文件夹下的所有的文件，确定删除？");
			var filenames = "{filename:"+ filename +"}";
			if(flag == true){
				$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {filename:filenames,path:path,type: "deleteFolder"},
					success: function(){
						doDirectory();
					}
				});
			}
		}else if(op == "copy"){
			doCopy("copyFile",filename);
		}else if(op == "cut") {
			doCopy("cutFile",filename);
		}
	});

	function doCopy(type,filename){
		$(".file-copy").css("display","block");
		var oldPath = getPath();

		$("#mobile-cancel").click(function(){
			$(".file-copy").css("display","none");
			$(".mobile-folder-false").remove();
		});

		$("#mobile-paste").click(function(){
			var newPath = getPath();
			if(newPath != oldPath){
				oldPath = oldPath + "/" + filename;
				$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {oldpath: oldPath,newpath: newPath,filename: filename,type: type},
					success: function(){
						$(".file-copy").css("display","none");
						doDirectory();
					}
				});
			}
		});

		$("#mobile-newFolder").click(function () {
			$(".mobile-folder-false").remove();
			var $DivFa = $("<div class='mdl-cell mdl-cell--4-col mobile-folder-info mobile-folder-false'></div>");
			var $FolderSVG = $("<div class='mobile-folder-img'><svg x='0px' " +
				"y='0px' height='24px' width='24px' focusable"+
				"='false' viewBox='0 0 24 24' fill='#8f8f8f'>"+
				"<g><path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 " +
				"18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'>"+
				"</path><path d='M0 0h24v24H0z' fill='none'></path>" +
				"</g></svg></div>");
			var $div = $("<div></div>")
			var $foldername = $("<input class='foldername' type='text' value='新建文件夹' />");
			var $sure = $("<span class='index-show-folder-sure'><img src=' ../../icon/sign-check.svg '></span>");
			var $close = $("<span class='index-show-folder-cancel'><img src=' ../../icon/sign-error.svg '></span>");

			$div.append($foldername);
			$div.append($sure);
			$div.append($close);
			$DivFa.append($FolderSVG);
			$DivFa.append($div);
			$("#mobile-folder-cell").append($DivFa);
			$(".index-show-folder-sure").click(function(){
				insertFolderList($(this).parent());
			});
			$(".index-show-folder-cancel").click(function(){
				$(".mobile-folder-false").remove();
			});
		});
	}


	function insertFolderList($parent){
		var path = getPath();
		var foldername =$parent.find(".foldername").eq(0).val();
		$.ajax({
			url: "/console/rest/folderoperation/FolderOperation",
			type: "POST",
			data: {filename: foldername,path: path,type: "createFolder"},
			success: function(){
				doDirectory();
			}
		});
	}

	$("#mobile-folder-title").click(function(){

		var $menuRoot = $("#page-menu-header");
		var $menuFolder = $menuRoot.find(".menu-folder");
		var $menuNext = $menuRoot.find(".menu-next");

		if($menuFolder.length == 1){
			return ;
		}

		$menuFolder.eq($menuFolder.length - 1).remove();
		$menuNext.eq($menuFolder.length - 1).remove();

		$(".index-loading").css("display","block");
		var filename = $menuFolder.eq($menuFolder.length - 2).text();
		if(filename != null || filename != ""){
			$("#mobile-folder-title").text(filename);
		}

		doDirectory();

	});

	//文件及文件夹显示
	function doDirectory(){
		path = getPath();
		$.ajax({
			url: "/console/rest/filedirectory/FileDirectory?directory="+path+"&time"+ new Date().getTime(),
			type: "get",
			success: function(str){
				$(".index-loading").css("display","none");
				doJson(str);
			},
			error: function(){
			}
		});
	}

	//Json数据
	function doJson(json){
		$(".mobile-cell").html("");
		var Json = JSON.parse(json);
		var files = Json["files"];
		for(var attr in files){
			var type = files[attr]["itemType"];
			if(type == "folder"){
				doCreateFolder(files[attr]["itemName"]);
			}else{
				doCreateFile(files[attr]["itemName"]);
			}
		}
	}

	//创建文件夹
	function doCreateFolder(filename){
		var $DivFa = $("<div class='mdl-cell mdl-cell--4-col mobile-folder-info'></div>");
		var $FolderSVG = $("<div class='mobile-folder-img'><svg x='0px' " +
			"y='0px' height='24px' width='24px' focusable"+
			"='false' viewBox='0 0 24 24' fill='#8f8f8f'>"+
			"<g><path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 " +
			"18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'>"+
			"</path><path d='M0 0h24v24H0z' fill='none'></path>" +
			"</g></svg></div>");
		var $FolderName = $("<div class='mobile-folder-name'>" + filename + "</div>");
		var $FolderImg = getOpImg();

		$DivFa.append($FolderSVG);
		$DivFa.append($FolderName);
		$DivFa.append($FolderImg);
		$("#mobile-folder-cell").append($DivFa);
	}

	//创建文件
	function doCreateFile(filename){
		var index = filename.lastIndexOf(".");
		var type = filename.substring(index+1,filename.length);
		var $DivFa = $("<div class='mdl-cell mdl-cell--4-col mobile-file-setting'></div>");
		var $FileViewDiv = $("<div class='mobile-file-view'></div>");
		var $FileViewImg = $("<img src='' class='mobile-file-view-img'/>");

		var $FileInfo = $("<div calss='mobile-file-info'></div>");
		var $FileTypeDiv = $("<div class='mobile-folder-img'></div>");
		var $FileTypeImg = $("<img />");

		var $FileName = $("<div class='mobile-folder-name'>" + filename + "</div>");
		var $FileImg = getOpImg();

		$FileViewImg = setImgSrc($FileViewImg, type);
		$FileTypeImg = setImgSrc($FileTypeImg, type);

		$FileTypeDiv.append($FileTypeImg);
		$FileInfo.append($FileTypeDiv);
		$FileInfo.append($FileName);
		$FileInfo.append($FileImg);
		$FileViewDiv.append($FileViewImg);
		//$DivFa.append($FileViewDiv);
		$DivFa.append($FileInfo);

		$("#mobile-file-cell").append($DivFa);
	}


	//文件类别
	function setImgSrc($imgtype,type){
		if(type == "jpg" || type =="gif" || type =="png" || type =="svg"){
			$imgtype.attr("src","../../icon/file-picture.svg");
		}else if(type == "doc" || type == "docx"){
			$imgtype.attr("src","../../icon/file-word.svg");
		}else if(type == "xls" || type == "xlsx"){
			$imgtype.attr("src","../../icon/file-picture.svg");
		}else if(type == "ppt" || type == "pptx"){
			$imgtype.attr("src","../../icon/file-powerpoint.svg");
		}else if(type == "zip"){
			$imgtype.attr("src","../../icon/file-zip.svg");
		}else if(type == "pdf"){
			$imgtype.attr("src","../../icon/file-pdf.svg");
		}else if(type == "apk"){
			$imgtype.attr("src","../../icon/ic_android_black_24px.svg");
		}else if(type == "exe"){
			$imgtype.attr("src","../../icon/file-exe.ico");
		}else if(type == "mp4" || type == "mp3"){
			$imgtype.attr("src","../../icon/file-sound.svg");
		}else if(type == "txt"){
			$imgtype.attr("src","../../icon/file-text.svg");
		}else if(type == "asp" || type == "css" ||  type == "js" || type == "jsp" || type == "php" || type == "java" || type == "cpp" || type == "xml" || type == "html" || type == "htm"){
			$imgtype.attr("src","../../icon/file-code.svg");
		}else if(type == "avi" || type == "rmvb" || type == "mkv" || type == "wmv" || type == "rm"){
			$imgtype.attr("src","../../icon/file-video.svg");
		}else{
			$imgtype.attr("src","../../icon/floppy.svg");
		}
		return $imgtype;
	}

	//得到图片元素
	function getOpImg(){
		var $OpImg = $("<div class='mobile-folder-operation' id='demo-menu-lower-right'>"+
			"<svg x='0px' y='0px' width='22px' height='22px' viewBox='0 0 24 "+
			"24' enable-background='new 0 0 24 24' xml:space='preserve'><g id"+
			"='Header'><g><rect x='-618' y='-3256' fill='none' width='1400' " +
			"height='3600'></rect></g></g><g id='Label'></g><g id='Icon'><g>" +
			"<rect fill='none' width='24' height='24'></rect><path fill='#bdbdbd'" +
			"d='M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z" +
			" M13,17h-2v-6h2V17z M13,9h-2V7h2V9z'></path></g></g><g id='Grid' display='none'>"+
			"<g display='inline'></g></g></svg></div>");
		return $OpImg;
	}


	//获取文件父元素
	function getFatherElement(parent,child){
		if(child.parentNode == parent){
			return child;
		}else{
			return getFatherElement(parent,child.parentNode);
		}
	}

	//获取文件当前路径
	function getPath(){
		var $directory = $("#page-menu-header").find(".menu-folder");
		var path = "";
		for(var i = 1;i < $directory.length; i++){
			path +=($directory.eq(i).text() + "/");
		}
		return path;
	}
});