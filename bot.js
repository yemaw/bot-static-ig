
var images = [];
$(document).ready(function(){
	
if(!$("#token").val() && Cookies.get('token')){
	$("#token").val(Cookies.get('token'));
}
if(!$("#tags").val() && Cookies.get('tags')){
	$("#tags").val(Cookies.get('tags'));
}

$("#startbot").click(function(){


	Cookies.set('token', $("#token").val());
	Cookies.set('tags', $("#tags").val());
	
	var token = $("#token").val();
	var tags = $("#tags").val();

	if(tags.length === 0) {alert('tag is empty');}
	
	

	var url = {
		tag:'https://api.instagram.com/v1/tags/'+tags[0]+'/media/recent?access_token='+token
	};
	
	
	$.ajax({
		url:url.tag,
		dataType: 'jsonp',
		success:function(result){
    		images = result.data;
    		likeImage(token);

    		for(var i=0; i<images.length; i++){
//    			$("#logs").append('<br />'+images[i].id + '<img style="width:40px;height:40px;" src="' + images[i].images.low_resolution.url + '" />');
    		}
  	}});

});

});

function likeImage(token){
	image = images.pop();
	$("#current_image").attr('src', image.images.thumbnail.url);

	var url = 'https://api.instagram.com/v1/media/'+image.id+'/likes?access_token='+token;

	var xmlhttp =new XMLHttpRequest();

	//xmlhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    $("#logs").append('<br />'+url +' - ' +image.id + ' - <a href="' + image.link + '" >'+image.link+'</a> - '+ JSON.stringify(xmlhttp.responseText));
			likeImage(token);
		
    }
  }
xmlhttp.open("POST",url,true);
xmlhttp.send();

/*
	$.post(url,{}, function(data,status,xhr){
		$("#logs").append('<br />'+url +' - ' +image.id + ' - <a href="' + image.link + '" >'+image.link+'</a> - '+ JSON.stringify(data));
			likeImage(token);
		}, "jsonp");*/
	/*
	$.post({
		url:url,
	 	type:'POST',
		dataType: 'jsonp',
		success:function(result){
			
			$("#logs").append('<br />'+image.id + ' - <a href="' + image.link + '" >'+image.link+'</a> - '+ JSON.stringify(result));
			likeImage(token);
		}
	 });
*/
}

























