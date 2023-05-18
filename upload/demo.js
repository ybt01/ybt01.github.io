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



function blink()
{
  document.getElementById('content').style.borderColor = 'gray';
}

async function readfiles(){
	var dz = document.getElementById('content');
	var files  = document.getElementById('fileinput').files;
	const readFileAsync = file => new Promise(resolve => {
		read = new FileReader();
			read.readAsBinaryString(file);
			read.onload = function(){
				console.log(file.name);
				console.log(read.result);
				$('input').remove();
				var h2e = document.createElement("h2");
				var pe = document.createElement("p");
				var bre = document.createElement("br");
				h2e.innerText = file.name;
				pe.innerText = read.result;
				dz.appendChild(h2e);
				dz.appendChild(pe);
				dz.appendChild(bre);
			}	
	});
		 	readFileAsync(files[0]);
}


