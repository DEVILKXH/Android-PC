$(function(){

	//初始化
	init();

	var $oFiles = $(".index-files-list");
	var $oFileMenu = $("#contentmenu");
	var $documentMenu = $("#documentmenu");
	var $main = $("#main");
	var $filelist = $("#file-list");
	var flag = false;
	var filename;
	var folderPath = "all";
	var initJson = null;

	//初始化
	function init(){

		if (navigator.userAgent.match(/IEMobile|BlackBerry|Android|iPod|iPhone|iPad/i)) {
			//是移动设备
			window.location.href = "mobile/mobile.html";
		}

		if(initJson == null){
			initJson =	doDirectory();
		}else{
			for(var attr in initJson){
				var type = initJson[attr]["itemType"];
				var path = getPath();
				createfile(initJson[attr]["itemName"],initJson[attr]["itemTime"],initJson[attr]["itemSize"],type,path);
			}
		}
	}
	
/*****************左边导航事件******************************************/
$(".mdl-navigation__link").click(function(){
	var $active = $(this);
	if($active.attr("type") == "all"){
		$(".menu-folder").css("visibility","visible");
		$(".menu-next").css("visibility","visible");

		$("#file-list").css("display","block");
		$("#classify-list").css("display","none");
	}else{
		$(".menu-folder").css("visibility","hidden");
		$(".menu-next").css("visibility","hidden")
		$("#file-list").css("display","none");
		$("#classify-list").css("display","block");
	}
});
/*************鼠标点击事件*****************************************************/
 	//文件列表事件代理****************文件单击事件
	$filelist.bind('click',function(ev){
		var oEvent = event || ev;
		var obj = oEvent.target;
		
		if(obj.tagName.toLowerCase() == 'a'){
			window.location.href = obj.href;
			return;
		}
		
		var file = getFatherElement(this,obj);
		$("#page-menu-header").find("svg").css("display","block");
		$oFileMenu.css("display","none");
		$documentMenu.css("display","none");
		$(this).find(".index-files-list").removeClass("active");
		$(file).addClass("active");
		return false;
	});
	
	//文件列表事件代理****************文件双击事件
	$filelist.bind('dblclick',function(ev){
		var oEvent = event || ev;
		var obj = oEvent.target;
		var file = getFatherElement(this,obj);
		var filename = $(file).find(".index-filename").eq(0).text();
		var index = filename.indexOf(".");

		$("#page-menu-header").find("svg").css("display","none");
		
		if(index == -1){
			var  $menuRoot = $("#page-menu-header");
			var $span2 = $("<span class='menu-next'>></span>");
			var $span = $("<span class='menu-folder' index='"+ $(".menu-folder").length +"'>"+ filename +"</span>");
			$menuRoot.append($span2);
			$menuRoot.append($span);
			$(".index-files-list").remove();
			$("#index-loading").css("display","block");
			doDirectory();
		}else{
			return false;
		}
	});
	
	//文件自定义右键菜单
	$filelist.bind('contextmenu',function(ev){
		var oEvent = event || ev;
		var top = getPosition(ev,$oFileMenu,"top");
		var left = getPosition(ev,$oFileMenu,"left");
		var obj = oEvent.target;
		
		var file = getFatherElement(this,obj);
		$("#page-menu-header").find("svg").css("display","block");
		$documentMenu.css("display","none");
		$(this).find(".index-files-list").removeClass("active");
		$oFileMenu.css("top",top);
		$oFileMenu.css("left",left);
		$oFileMenu.css("display","block");

		$oFileMenu.bind('mousewheel',function(){
			return false;
		});
		$oFileMenu.bind('DOMMouseScroll',function(){
			return false;
		});

		$(file).addClass("active");
		return false;
	});

	$("#classify-list").bind('contextmenu',function(){
		return false;
	});
	//文档自定义右键菜单
	$("#main").bind('contextmenu',function(ev){
		var top = getPosition(ev,$documentMenu,"top");
		var left = getPosition(ev,$documentMenu,"left");
		$oFileMenu.css("display","none");
		$("#page-menu-header").find("svg").css("display","none");
		$(this).find(".index-files-list").removeClass("active");
		$documentMenu.css("top",top);
		$documentMenu.css("left",left);
		$documentMenu.css("display","block");
		$documentMenu.bind('mousewheel',function(){
			return false;
		});
		$documentMenu.bind('DOMMouseScroll',function(){
			return false;
		});

		return false;
	});
	
	$(document).bind('contextmenu',function(){
		$(this).find(".index-files-list").removeClass("active");
		$("#page-menu-header").find("svg").css("display","none");
		$oFileMenu.css("display","none");
		$documentMenu.css("display","none");
		return false;
	});

	$(document).bind('mousewheel',onMouseWheel);
	$(document).bind('DOMMouseScroll',onMouseWheel);

	function onMouseWheel(){
		$oFileMenu.css("display","none");
		$documentMenu.css("display","none");
	}

	$oFileMenu.click(function(){
		$(this).css("display","none");
	});
	
	$documentMenu.click(function(){
		$(this).css("display","none");
	});
	
	$(document).click(function(){
		$("#page-menu-header").find("svg").css("display","none");
		$oFileMenu.css("display","none");
		$documentMenu.css("display","none");
		$(this).find(".index-files-list").removeClass("active");
	});
	
	//获取文件父元素
	function getFatherElement(parent,child){
		if(child.parentNode == parent){
			return child;
		}else{
			return getFatherElement(parent,child.parentNode);
		}
	}
	//获取右键菜单坐标
	function getPosition(ev,obj,type){
		var oEvent = event || ev;
		if(type == "top"){
			var top = oEvent.pageY;
			var height = parseInt(obj.css("height"));
			var maxheight = document.documentElement.clientHeight;
			if(maxheight - top < height){
				top -= height;
			}
			return top + "px";
		}else if(type == "left"){
			var left = oEvent.pageX;
			var width = parseInt(obj.css("width"));
			var maxwidth = document.documentElement.clientWidth;
			if(maxwidth - left < width){
				left -= width;
			}
			return left + "px";
		}
		return 0;
	}
/********************路径点击时间************************************************/	
	$("#page-menu-header").bind('click',function(ev){
		var oEvent = event || ev;
		var activeObj = oEvent.target;
		var objclass = $(activeObj).attr("class");
		if( objclass == "menu-folder"){
			$(".index-files-list").remove();
			$("#index-loading").css("display","block");
			doMenu($(activeObj).attr("index"));
		}
	});
	
	
	function doMenu(index){
		if(index == null || index == "underfine" || index == ""){
			index = 0;
		}
		var $next = $(".menu-next");
		var $menu = $(".menu-folder");
		for(var i = $menu.length - 1; i > 0; i--){
			if(i > index){
				$menu.eq(i).remove();
				$next.eq(i-1).remove();
			}
		}
		doDirectory();
	}
/*****************文件上传*****************************************************/
	$("#uploadfile").change(function(){
	  	var file = this.files;
	  	createProrassBar(file,function(){
	  		var upload = uploadFiles(file);
	  	});
	});
	
	//创建文件和进度条
	function createProrassBar(files,fn){
		var $Filelist = $("#file-list");
		for(var i = 0;i < files.length;i++){
			var filename = files[i]["name"];
			var index = filename.lastIndexOf(".");
	 		//文件扩展名
			var type = filename.substring(index+1,filename.length);
			var $oDiv = $("<div class='mdl-grid index-cell-content index-files-list'></div>");
	 		var $oDiv1 = $("<div class='mdl-cell mdl-cell--6-col index-cell text-ellipsis'></div>");
	 		var $oDiv2 = $("<div class='mdl-cell mdl-cell--2-col index-cell'></div>");
	 		var $oDiv3 = $("<div class='mdl-cell mdl-cell--4-col index-cell'></div>");
	 		
	 		//文件类型
	 		var $imgtype = $("<img class='img-type' />");
	 		//文件名
	 		var $filename = $("<span class='index-filename text-ellipsis'>" + filename + "</span>")
	 		//文件时间
	 		var $filetime = $("<span class='default'>" + userDate(new Date().getTime()) + "</span>");
	 		//文件进度条
	 		var $progress = $("<progress class='progress' min='0' value='0' max='"+ files[i]["size"] +"' id='"+ files[i]["name"] +"'></progress>");
	 		var $number = $("<span class='number'>0%</span>");
	 		//文件类型
	 		if(type == "folder"){
	 			$imgtype.attr("src","../icon/folder.svg");
			}else if(type == "jpg" || type =="gif" || type =="png" || type =="svg"){
				$imgtype.attr("src","../icon/file-picture.svg");
	 		}else if(type == "doc" || type == "docx"){
	 			$imgtype.attr("src","../icon/file-word.svg");
	 		}else if(type == "xls" || type == "xlsx"){
	 			$imgtype.attr("src","../icon/file-picture.svg");
	 		}else if(type == "ppt" || type == "pptx"){
	 			$imgtype.attr("src","../icon/file-powerpoint.svg");
	 		}else if(type == "zip" || type == "rar" || type == "7z"){
	 			$imgtype.attr("src","../icon/file-zip.svg");
	 		}else if(type == "pdf"){
	 			$imgtype.attr("src","../icon/file-pdf.svg");
	 		}else if(type == "apk"){
	 			$imgtype.attr("src","../icon/ic_android_black_24px.svg");
	 		}else if(type == "exe"){
	 			$imgtype.attr("src","../icon/file-exe.ico");
	 		}else if(type == "mp4" || type == "mp3"){
	 			$imgtype.attr("src","../icon/file-sound.svg");
	 		}else if(type == "txt"){
	 			$imgtype.attr("src","../icon/file-text.svg");
	 		}else if(type == "asp" || type == "css" ||  type == "js" || type == "jsp" || type == "php" || type == "java" || type == "cpp" || type == "xml" || type == "html" || type == "htm"){
	 			$imgtype.attr("src","../icon/file-code.svg");
	 		}else if(type == "avi" || type == "rmvb" || type == "mkv" || type == "rm"){
	 			$imgtype.attr("src","../icon/file-video.svg");
	 		}else{
	 			$imgtype.attr("src","../icon/floppy.svg");
	 		}
	 		
	 		//插入名称
	 		$oDiv1.append($imgtype);
	 		$oDiv1.append($filename);
	 		//插入时间
	 		$oDiv2.append($filetime);
	 		//插入文件大小
	 		$oDiv3.append($progress);
	 		$oDiv3.append($number);

	 		$oDiv.append($oDiv1);
	 		$oDiv.append($oDiv2);
	 		$oDiv.append($oDiv3);
	 		
	 		$("#file-list").append($oDiv);
		}
		if(fn){
			fn();
		}
	}
	
	//文件上传准备
	function uploadFiles(file){
		var i = 0;
		var length = file.length;
		var path = getPath();
		flag = true;
		setFileName(i,length,path,file);
	}
	//设置文件名
	function setFileName(i,length,path,file){
		if(i < length){
			filename = file[i]["name"];
	  		$.ajax({
	  			url: "/console/rest/filename/FileName",
	  			type: "POST",
	  			data: {filename: filename,filepath: path},
	  			success: function(){
	  				showProgressbar();
					upload(i,length,path,file);	
	  			}
	  		});
		}else{
			flag = false;
			doNumber();
			alert("上传成功");
			doDirectory();
		}
	}
	//上传
	function upload(i,length,path,file){
		$.ajax({
  			url: "/console/rest/fileupload/FileUpload",
  			type: "POST",
  			data: file[i],
  			contentType: false,
   			processData: false, 
  			success: function(str){
  				i++;
  				document.getElementById(filename).value = document.getElementById(filename).max;
  				doNumber();
				setFileName(i,length,path,file);
  			},
  			error: function(){
  			}
  		});
	}
	
	//进度条查询
	function showProgressbar(){
		setTimeout(function(){
	 		$.ajax({
	 			url: "/console/rest/progressbar/ProgressBar",
	 			success: function(str){
	 				showBar(str);
	 			},
	 			error: function(){
	 				alert("bar error");
	 			}
	 		});
	  	},200);
	}
	
	//显示进度条
	function showBar(str){
	 	console.log(filename);
		document.getElementById(filename).value = str;
	 	doNumber();
	 	if(flag == true){
	 		showProgressbar();
	 	}
	}
	
	//显示百分比
	function doNumber(){
		var $progress = $(".progress");
		var $span = $(".number");
		for(var i = 0; i < $progress.length; i++){
			var value = $progress.eq(i).attr("value");
			var max = $progress.eq(i).attr("max");
			var number = value/max;
			number *= 100;
			$span.eq(i).text(number.toFixed(2)+'%');
		}
	}
	
/************* 文件夹操作*****************************************/
	//新建文件夹
	$("#file-newfolder").click(function(){
		$documentMenu.css("display","none");
		var foldername = window.prompt("请输入文件夹名","新建文件夹");
		var path = getPath();
		$(".index-files-list").remove();
		$("#index-loading").css("display","block");
		$.ajax({
			url: "/console/rest/folderoperation/FolderOperation",
			type: "POST",
			data: {filename: foldername,path: path,type: "createFolder"},
			success: function(){
				$("#index-loading").css("display","none");
				doDirectory();
			}
		});
	});
	
	//删除文件
	$("#svg-delete").eq(0).click(doDelete);
	$("#file-delete").click(doDelete);
	function doDelete(){
		var $fileactive = $("#file-list").find(".active");
		var $file = $fileactive.find(".index-filename");
		var filename = $file.eq(0).text();
		var flag = window.confirm("将删除文件夹下的所有的文件，确定删除？");
		if(flag == true){

			var filenames = "{filename:"+ filename +"}";
			var path = getFilePath();

			$(".index-files-list").remove();
			$("#index-loading").css("display","block");
			$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {filename:filenames,path:path,type: "deleteFolder"},
					success: function(str){
						$("#index-loading").css("display","none");
						if(folderPath == "all"){
							doDirectory();
						}else{
							doGetClassifyFile(folderPath);
						}
					},
					error: function(){
						alert("error");
					}
			});
		}
	}
	
	//重命名
	$("#svg-rename").eq(0).click(doRename);
	$("#file-rename").click(doRename);
	function doRename(){
		$oFileMenu.css("display","none");
		var $fileactive = $("#file-list").find(".active");
		var $file = $fileactive.find(".index-filename");
		var name = $file.eq(0).text();

		var filename = window.prompt("请输入文件名",name);
		if(filename != "" && filename != null && filename != "null"){
			var path = getFilePath();
			$(".index-files-list").remove();
			$("#index-loading").css("display","block");
			$.ajax({
				url: "/console/rest/folderoperation/FolderOperation",
				type: "POST",
				data: {oldfile: name,newfile: filename,path: path,type: "renameFile"},
				success: function(){
					$(".index-files-list").remove();
					$("#index-loading").css("display","none");
					if(folderPath == "all"){
						doDirectory();
					}else{
						doGetClassifyFile(folderPath);
					}
				}
			});
		}
	}
	
	//文件下载
	$("#svg-download").eq(0).click(doDownload);
	$("#file-download").click(doDownload);
	function doDownload(){
		var $fileactive = $("#file-list").find(".active");
		var $file = $fileactive.find(".download");
			//window.location.href = $file.attr("href");
			window.open($file.attr("href"));
	}

	function getFilePath(){
		var $fileactive = $("#file-list").find(".active");
		var $file = $fileactive.find(".download");
		var url = $file.attr("href");
		var path2 = url.split('filepath')[1];
		console.log(path2);
		var path1 = path2.split('filename')[0];
		console.log(path1);
		var path = path1.substring(1,path1.length-1); 
		console.log(path);
		return path;
	}
	//文件剪切和复制

	//文件移动
	$("#file-copy").click(function(){
		$(".index-moveTo-title").eq(0).text("复制到");
		doFileCopy("copyFile");
	});

	$("#file-cut").click(function(){
		$(".index-moveTo-title").eq(0).text("移动到");
		doFileCopy("cutFile");
	});


	function doFileCopy(type){

		var $fileactive = $("#file-list").find(".active");
		var $file = $fileactive.find(".index-filename");
		var filename = $file.eq(0).text();
		$("#all-folder").removeClass("index-file-remove");
		$("#all-folder").addClass("index-file-add");
		var oldPath = getPath();
		oldPath = oldPath + "/" + filename;

		//模块显示
		$("#index-moveTo").css("display","block");

		//模块取消
		$("#button-cancel").click(function(){
			$("#index-moveTo").css("display","none");
			$("#all-folder").removeClass("index-file-remove");
			$("#all-folder").addClass("index-file-add");
			$(".index-folder-name").parent().parent().remove();
		});


		//初始化选择文件夹列表
		$("#index-moveTo-list").find("ul").remove();

		//新建文件夹

		$("#button-newFolder").click(function(){
			var $folderOpen = $(".index-list-set-header-active").find("span").eq(1);
			var $ul = $folderOpen.find("ul").eq(0);
			if($ul.css("display") == "none"){
				FolderActive($folderOpen);
			}


			var $folder = $("#index-moveTo-list").find(".index-list-set-header-active");
			if($folder.length != 0){
				var path = getFolderSources($folder.eq(0));
				var $father = $folder.parent();
				var $ul = $father.find("ul");
				if($ul.length == 0){
					$ul = $("<ul class='demo-list-icon mdl-list index-moveTo-list'></ul>");
				}
				insertIntoLi($ul,$father);
			}else{
				alert("请选择文件夹");
			}

			//新建文件夹确定
			$(".index-show-folder-sure").click(function(){

				var path = "";
				var $fatherDIV = $(this).parent();
				var $fatherLI = $fatherDIV.parent();
				var foldername = $fatherDIV.find(".index-folder-name").eq(0).val();
				path = getFolderSources($(this));

				$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {filename: foldername,path: path,type: "createFolder"},
					success: function(){
						changeFolderStatus($fatherDIV);
					}
				});
			});

			//新建文件夹，改变文件夹状态
			function changeFolderStatus($obj){
				var foldername = $obj.find(".index-folder-name").eq(0).val();
				$obj.find(".index-folder-name").remove();
				$obj.find(".index-show-folder-sure").remove();
				$obj.find(".index-show-folder-cancel").remove();
				$obj.append("<span class='index-folder-move'>"+ foldername +"</span>");
			}

			//新建文件夹取消
			$(".index-show-folder-cancel").click(function(){
				$(this).parent().parent().remove();
			});
		});


		//复制粘贴确定
		$("#button-sure").click(function(){

			var $folder = $("#index-moveTo-list").find(".index-list-set-header-active");
			if($folder.length != 0){
				$("#index-moveTo-container").css("display","none");
				$("#index-moveTo").find("#index-loading-move").css("display","block");
				//$("#index-moveTo").css("background","none");
				var newPath = getFolderSources($folder);
				$.ajax({
					url: "/console/rest/folderoperation/FolderOperation",
					type: "POST",
					data: {oldpath: oldPath,newpath: newPath,filename: filename,type: type},
					success: function(){

						$("#all-folder").removeClass("index-file-remove");
						$("#all-folder").addClass("index-file-add");
						$("#index-moveTo").css("display","none");


						$("#index-moveTo").css("background","rgba(0,0,0,0.5)");
						$("#index-moveTo-container").css("display","block");
						$("#index-moveTo").find("#index-loading-move").css("display","none");
						doCreateMenu(newPath);
						doDirectory();
					}
				});
			}else{
				alert("请选择文件夹");
			}
		});
	}

	function doCreateMenu(path){
		var menu = path.split("/");
		var $next = $(".menu-next");
		var $menu = $(".menu-folder");
		for(var i = 1; i < $menu.length; i++){
			$menu.eq(i).remove();
		}
		$next.remove();
		var  $menuRoot = $("#page-menu-header");
		for(var i = 0; i < menu.length - 1; i++){
			var $span2 = $("<span class='menu-next'>></span>");
			var $span = $("<span class='menu-folder' index='"+ $(".menu-folder").length +"'>"+ menu[i] +"</span>");
			$menuRoot.append($span2);
			$menuRoot.append($span);
		}
	}

	//事件代理  li点击事件 显示文件夹
	$("#index-moveTo-list").bind("click",function(ev){
		var oEvent = ev || event;
		var obj = oEvent.target;
		obj.scrollIntoView(true);
		if($(obj).attr("class").split(" ")[0] == "index-show-folder"){
			changeFolderOpen($(obj));
		}else if($(obj).attr("class") == "index-folder-move"){
			FolderActive($(obj));
		}else if($(obj).attr("class") == "index-file-open" || $(obj).attr("class") == "index-file-close" ){
			var $parent = $(obj).parent();
			var $foldername = $parent.find("span").eq(2);
			FolderActive($foldername);
		}else if($(obj).attr("class") == "index-list-set-header" || $(obj).attr("class") == "index-list-set-header index-list-set-header-active" ){
			var $folderOpen = $(obj).find("span").eq(1);
			FolderActive($folderOpen);
		}
	});

	//插入新建的文件夹
	function insertIntoLi($parent,$gfparent){
		var $div = $("<div class='index-list-set-header'></div>");
		var $span2 = $("<span class='index-file-close' ></span>");
		var $span1 = $("<span class='index-show-folder index-file-add index-none-file'></span>");
		var $name = $("<input class='index-folder-name' value='新建文件夹' type='text' />");
		var $sure = $("<span class='index-show-folder-sure'></span>");
		var $close = $("<span class='index-show-folder-cancel'></span>");
		var $li = $("<li class='mdl-list__item index-list-set'></li>");
		$div.append($span1);
		$div.append($span2);
		$div.append($name);
		$div.append($sure);
		$div.append($close);
		$li.append($div)
		$parent.append($li);
		$gfparent.append($parent);
	}

	//文件夹active
	function FolderActive($obj){
		var $parent = $obj.parent();
		var $fileOpen = $parent.find("span").eq(0);
		if($fileOpen.attr("class") != "index-show-folder index-file-add index-none-file"){
			changeFolderOpen($fileOpen);
		}
		$(".index-list-set-header").removeClass("index-list-set-header-active");
		$parent.addClass("index-list-set-header-active");
	}

	//文件夹打开关闭状态
	function changeFolderOpen($obj){
		var $parent = $obj.parent().parent();
		if($obj.attr("class") == "index-show-folder index-file-remove"){
			$obj.attr("class","index-show-folder index-file-add");
			var $brother = $obj.parent().find("span");
			$brother.eq(1).attr("class","index-file-close");
			var $ul = $parent.find("ul").eq(0);
			$ul.css("display","none");
		}else{
			$obj.attr("class","index-show-folder index-file-remove");
			var $brother = $obj.parent().find("span");
			$brother.eq(1).attr("class","index-file-open");
			var path = getFolderSources($brother);
			var $ul = $parent.find("ul");
			if($ul.length == 0){
				getSourcesFolder(path,$parent);
			}else{
				$ul.eq(0).css("display","block");
			}
		}
	}

	//获取源文件路径
	function getFolderSources($obj){
		var path = "";
		var $parent = $obj.parent()
		while($parent.attr("id") != "index-moveTo-list"){
			if($parent.attr("class") == "mdl-list__item index-list-set"){
				var $folderName = $parent.find("span").eq(2);
				path = $folderName.text() + "/"  + path;
			}
			$parent = $parent.parent();
		}
		return path;
	}


	//获取子文件夹信息
	function getSourcesFolder(path,$obj){
		$.ajax({
			url: "/console/rest/folderoperation/FolderOperation",
			type: "POST",
			data:{type: "sourcesFolder",path: path},
			success: function(str){
				doSocuresFolder(str,$obj);
			}
		});
	}

	//创建文件夹列表
	function doSocuresFolder(json,$obj){
		var folder = JSON.parse(json);
		var folders = folder.files;
		var $ul = $("<ul class='demo-list-icon mdl-list index-moveTo-list'></ul>");
		for(var attr in folders){
			var folderName = folders[attr]["itemName"];
			var hasChild = folders[attr]["itemChild"];
			var $div = $("<div class='index-list-set-header'></div>");
			var $span2 = $("<span class='index-file-close' ></span>");
			var $span1 = $("<span class='index-show-folder index-file-add'></span>");
			var $span = $("<span class='index-folder-move'>"+ folderName +"</span>");
			var $li = $("<li class='mdl-list__item index-list-set'></li>");

			if(hasChild == 1){
				$span1.addClass("index-none-file");
			}
			$div.append($span1);
			$div.append($span2);
			$div.append($span);
			$li.append($div);
			$ul.append($li);
		}
		$obj.find("ul").remove();
		$obj.append($ul);
	}
/*************************************************************/	
	//获取当前路径下的全部文件级文件夹
	function doDirectory(){
		var path;
		if(arguments.length == 0){
			path = getPath();
		}else{
			path = arguments[0];
		}
		$.ajax({
		 	url: "/console/rest/filedirectory/FileDirectory?directory="+path+"&time"+ new Date().getTime(),
			type: "get",
			success: function(str){
				$(".index-files-list").remove();
				$("#index-loading").css("display","none");
				var Json = JSON.stringify(str);
			    Json = JSON.parse(Json);
			    Json = JSON.parse(Json);
			    var files = Json["files"];
			    for(var attr in files){
			  		var type = files[attr]["itemType"];
			  		var path = getPath(); 
				  	createfile(files[attr]["itemName"],files[attr]["itemTime"],files[attr]["itemSize"],files[attr]["itemPath"],type,path);
			    }
				return files;
			},
			error: function(){
			}
		});  
	}
	
	//创建文件列表
	function createfile(filename,filetime,filesize,filepath,filetype,path){
		var index = filename.lastIndexOf(".");
 		//文件扩展名
		var type;
		if(index == -1){
			type = filetype;
		}else{
			type = filename.substring(index+1,filename.length);
		}
		var $oDiv = $("<div class='mdl-grid index-cell-content index-files-list'></div>");
 		var $oDiv1 = $("<div class='mdl-cell mdl-cell--6-col index-cell text-ellipsis'></div>");
 		var $oDiv2 = $("<div class='mdl-cell mdl-cell--2-col index-cell'></div>");
 		var $oDiv3 = $("<div class='mdl-cell mdl-cell--2-col index-cell'></div>");
 		var $oDiv4 = $("<div class='mdl-cell mdl-cell--2-col index-cell'></div>");
 		//文件类型
 		var $imgtype = $("<img class='img-type' />");
 		//文件名
 		var $filename = $("<span class='index-filename text-ellipsis'>" + filename + "</span>")
 		//文件时间
 		var $filetime = $("<span class='default'>" + userDate(filetime/1000) + "</span>");
 		//文件大小
 		var $filesize = $("<span class='default'>" + filesize + "</span>");
 		//文件下载
 		var $filedownload;
 		if(filetype == "file"){
			$filedownload = $("<a class='download' href='/console/rest/filedownload/FileDownload?filepath="+path+"&filename="+ filename +"&type=1' target='_blank'></a>");
		}else{
			$filedownload = $("<a class='download' href='/console/rest/filezip/FileZip?filepath="+path+"&filename="+ filename +"&type=2' target='_blank'></a>");
		}
 		//文件类型
 		if(type == "folder"){
 			$imgtype.attr("src","../icon/folder.svg");
		}else if(type == "jpg" || type =="gif" || type =="png" || type =="svg"){
			$imgtype.attr("src","../icon/file-picture.svg");
 		}else if(type == "doc" || type == "docx"){
 			$imgtype.attr("src","../icon/file-word.svg");
 		}else if(type == "xls" || type == "xlsx"){
 			$imgtype.attr("src","../icon/file-picture.svg");
 		}else if(type == "ppt" || type == "pptx"){
 			$imgtype.attr("src","../icon/file-powerpoint.svg");
 		}else if(type == "zip"){
 			$imgtype.attr("src","../icon/file-zip.svg");
 		}else if(type == "pdf"){
 			$imgtype.attr("src","../icon/file-pdf.svg");
 		}else if(type == "apk"){
 			$imgtype.attr("src","../icon/ic_android_black_24px.svg");
 		}else if(type == "exe"){
 			$imgtype.attr("src","../icon/file-exe.svg");
 		}else if(type == "mp4" || type == "mp3"){
 			$imgtype.attr("src","../icon/file-sound.svg");
 		}else if(type == "txt"){
 			$imgtype.attr("src","../icon/file-text.svg");
 		}else if(type == "asp" || type == "css" ||  type == "js" || type == "jsp" || type == "php" || type == "java" || type == "cpp" || type == "xml" || type == "html" || type == "htm"){
 			$imgtype.attr("src","../icon/file-code.svg");
 		}else if(type == "avi" || type == "rmvb" || type == "mkv" || type == "rm"){
 			$imgtype.attr("src","../icon/file-video.svg");
 		}else{
 			$imgtype.attr("src","../icon/floppy.svg");
 		}
 		
 		
 		//插入名称
 		$oDiv1.append($imgtype);
 		$oDiv1.append($filename);
 		//插入时间
 		$oDiv2.append($filetime);
 		//插入文件大小
 		$oDiv3.append($filesize);
 		//插入下载连接
		$oDiv4.append($filedownload);
 		

 		$oDiv.append($oDiv1);
 		$oDiv.append($oDiv2);
 		$oDiv.append($oDiv3);
 		$oDiv.append($oDiv4);
 		
 		$("#file-list").append($oDiv);
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
	
	//时间戳转化成时间
	function userDate(uData){
		var myDate = new Date(uData*1000);
	  	var year = myDate.getFullYear();
	  	var month = myDate.getMonth() + 1;
	  	var day = myDate.getDate();
	  	var hour = myDate.getHours();
	  	var min = myDate.getMinutes();
	  	var sec = myDate.getSeconds();
	  	
	  	return year + '-' + month + '-' + day + " " + hour + ":" + min + ":" +sec;
	}
});
