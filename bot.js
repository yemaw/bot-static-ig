var images = [];
var count = 0;
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
		
		getImages();
	});

});

function getImages(){
var token = $("#token").val();
	var tags = $("#tags").val();

	if(!tags) {alert('tag is empty'); return;}
	if(!token) {alert('token is empty');return;}
	

	var url = {
		tag:'https://api.instagram.com/v1/tags/'+tags+'/media/recent?access_token='+token
	};
	
	
	$.ajax({
		url:url.tag,
		dataType: 'jsonp',
		success:function(result){
			$("#logs").append('<br />'+url.tag);
    		images = result.data;
    		likeImage(token);
  	}});	
}

function likeImage(token){
	if(images.length === 0){
		getImages();
		return;
	}

	image = images.pop();
	//$("#current_image").attr('src', image.images.thumbnail.url);

	var url = 'https://api.instagram.com/v1/media/'+image.id+'/likes?access_token='+token;

	var xmlhttp =new XMLHttpRequest();
	

	$.ajax({
		url:'http://node.yemaw.me/get2post/get2post/get2post?url='+url,
		dataType: 'jsonp',
		success:function(result){
			
    		//$("#logs").append('<br />'+url +' - ' +image.id + ' - <a href="' + image.link + '" >'+image.link+'</a> - ');
    		$("#imgs_logs").append('<img src="'+image.images.low_resolution.url+'" />');
    		
    		setTimeout(function(){
    			likeImage(token)
    		},1000);
  		}, error:function(error){
  			//$("#logs").append('<br />- ' +image.id + ' - <a href="' + image.link + '" >'+image.link+'</a> - ';
  			$("#imgs_logs").append('<a href="' + image.link + '" target="_blank"><img src="'+image.images.low_resolution.url+'" /></a>');
  			count++;
  			$("#status").html("total liked = "+count);
    		setTimeout(function(){
    			likeImage(token)
    		},1000);
    		
  		}
  	});
}

