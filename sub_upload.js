var http_arr = new Array();
function doUpload() {
	document.getElementById('progress-group').innerHTML = ''; 
	document.getElementById('result').innerHTML = '';
	var files = document.getElementById('file').files;
	var checkEmpty = $('#file').val();
	if (checkEmpty != ''){
			$('#progress-group').css('display', 'block');
			for (i=0;i<files.length;i++) {
				uploadFile(files[i], i);
			}
	}
	return false;
}
function uploadFile(file, index) {
	var http = new XMLHttpRequest();
	http_arr.push(http);
	var ProgressGroup = document.getElementById('progress-group');
	var Progress = document.createElement('div');
	Progress.className = 'progress';
	var ProgressBar = document.createElement('div');
	ProgressBar.className = 'progress-bar';
	var ProgressText = document.createElement('div');
	ProgressText.className = 'progress-text';	
	Progress.appendChild(ProgressBar);
	Progress.appendChild(ProgressText);
	ProgressGroup.appendChild(Progress);
	var oldLoaded = 0;
	var oldTime = 0;
	http.upload.addEventListener('progress', function(event) {	
		if (oldTime == 0) { 
			oldTime = event.timeStamp;
		}	
		var fileName = file.name; 
		var fileLoaded = event.loaded; 
		var fileTotal = event.total; 
		var fileProgress = parseInt((fileLoaded/fileTotal)*100) || 1; 
		//Use variable
		ProgressBar.innerHTML = 'Uploading in progress...';
		ProgressBar.style.width = fileProgress + '%';
		if (fileProgress == 100) {
			ProgressBar.addClass('progress-bar progress-bar-striped bg-success active').html('Uploading in progress...');
		}
		oldTime = event.timeStamp; 
		oldLoaded = event.loaded; 
	}, false);
	var data = new FormData();
	data.append('filename', file.name);
	data.append('file', file);
	http.open('POST', './subtitles_loader.php', true);
	http.send(data);
	http.onreadystatechange = function(event) {
		if (http.readyState == 4 && http.status == 200) {			
			try { 
				var server = JSON.parse(http.responseText);
				if (server.status) {
					ProgressBar.className += ' progress-bar-success'; 
					ProgressBar.innerHTML = server.message; 
					document.getElementById("result").innerHTML = server.result;
				} else {
					ProgressBar.className += ' progress-bar-danger'; 
					ProgressBar.innerHTML = server.message; 
				}
			} catch (e) {
				ProgressBar.className += ' progress-bar-danger'; 
				ProgressBar.innerHTML = 'Please Try Again!'; 
			}
		}
		http.removeEventListener('progress'); 
	}
}
