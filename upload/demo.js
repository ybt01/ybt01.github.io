function showModal() {  //打开上传框
	var modal = document.getElementById('modal');
	var overlay = document.getElementsByClassName('overlay')[0];
	overlay.style.display = 'block';
	modal.style.display = 'block';
}
function closeModal() {  //关闭上传框
	var modal = document.getElementById('modal');
	var overlay = document.getElementsByClassName('overlay')[0];
	overlay.style.display = 'none';
	modal.style.display = 'none';
}
//用DOM2级方法为右上角的叉号和黑色遮罩层添加事件：点击后关闭上传框
document.getElementsByClassName('overlay')[0].addEventListener('click', closeModal, false);
document.getElementById('close').addEventListener('click', closeModal, false);

//利用html5 FormData() API,创建一个接收文件的对象，因为可以多次拖拽，这里采用单例模式创建对象Dragfiles
var Dragfiles=(function (){
	var instance;
	return function(){
		if(!instance){
			instance = new FormData();
		}
		return instance;
	}
}());
//为Dragfiles添加一个清空所有文件的方法
FormData.prototype.deleteAll=function () {
	var _this=this;
	this.forEach(function(value,key){
		_this.delete(key);
	})
}

//添加拖拽事件
var dz = document.getElementById('content');
dz.ondragover = function (ev) {
	//阻止浏览器默认打开文件的操作
	ev.preventDefault();
	//拖入文件后边框颜色变红
	this.style.borderColor = 'red';
}

dz.ondragleave = function () {
	//恢复边框颜色
	this.style.borderColor = 'gray';
}
dz.ondrop = function (ev) {
	//恢复边框颜色
	this.style.borderColor = 'gray';
	ev.preventDefault();
	var items = ev.dataTransfer.items;
	    for (var i=0; i<items.length; i++) {        
		var item = items[i].webkitGetAsEntry();  //Might be renamed to GetAsEntry() in 2020
		if (item) {
		    GetFileTree(item);
		}
	    }
	}


function blink()
{
  document.getElementById('content').style.borderColor = 'gray';
}

function GetFileTree(item, path) {
    path = path || "";
    if (item.isFile) {

        item.file(function(file) {
            console.log(file);
        });
        
    } else if (item.isDirectory) {

        console.log(item.fullPath);  //console.log(item.name)

        // Get folder contents  
        var dirReader = item.createReader();
        dirReader.readEntries(function(entries) {
            for (var i=0; i<entries.length; i++) {
                GetFileTree(entries[i], path + item.name + "/");
            }
        });
    }
}

//ajax上传文件
function upload(){
	if(document.getElementsByTagName('tbody')[0].hasChildNodes()==false){
		document.getElementById('content').style.borderColor = 'red';
		setTimeout(blink,200);
		return false;
	}
	var data=Dragfiles(); //获取formData
	$.ajax({
		url: 'upload',
		type: 'POST',
		data: data,
		async: true,
		cache: false,
		contentType: false,
		processData: false,
		success: function (data) {
			alert('succeed!')  //可以替换为自己的方法
			closeModal();
			data.deleteAll(); //清空formData
			$('.tbody').empty(); //清空列表
		},
		error: function (returndata) {
			alert('failed!')  //可以替换为自己的方法
		}
	});
}
// 用事件委托的方法为‘删除’添加点击事件，使用jquery中的on方法
$(".tbody").on('click','tr td:last-child',function(){
	//删除拖拽框已有的文件
	var temp=Dragfiles();
	var key=$(this).prev().prev().prev().text();
	console.log(key);
	temp.delete(key);
	$(this).parent().remove();
});
//清空所有内容
function clearAll(){
	if(document.getElementsByTagName('tbody')[0].hasChildNodes()==false){
		document.getElementById('content').style.borderColor = 'red';
		setTimeout(blink,300);
		return false;
	}
	var data=Dragfiles(); 
	data.deleteAll(); //清空formData
	//$('.tbody').empty(); 等同于以下方法
	document.getElementsByTagName('tbody')[0].innerHTML='';
}
