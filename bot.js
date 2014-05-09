var tags_table = [];

var images = [];
var count = 0;

$(document).ready(function(){
	$('#addsometags').click(function(){$('#tags').val('photooftheday\ncars\nmyanmar');});

	if(!$("#token").val() && Cookies.get('token')){
		$("#token").val(Cookies.get('token'));
	}
	if(!$("#tags").val() && Cookies.get('tags')){
		$("#tags").val(Cookies.get('tags'));
	}

	$("#startbot").click(function(){

		Cookies.set('token', $("#token").val());
		Cookies.set('tags', $("#tags").val());
		
		startBot();
	});

});

function startBot(){
	var token = $("#token").val();
	var tags = $("#tags").val();
	tags = tags.split("\n");
	if(tags.length === 0){
		alert('tags are empty');return;
	}
	if(!token) {alert('token is empty');return;}

	hash = []; //reset the global hash table

	//initialize hash with tags
	for(var i=0; i<tags.length;i++){
		hash[i] = {tag:tags[i].trim(),token:token}
	}

	
	async.eachSeries(tags_table, getImagesForATag, function(error){ //fill with images data into hash

		async.eachSeries(tags_table, proceedATagFormTagTable, function(error){
			
		});
	});

}

function getImagesForATag(tag, callback){

	var url = 'https://api.instagram.com/v1/tags/'+tag.tag+'/media/recent?access_token='+tag.token;
	$.ajax({
		url:url,
		dataType: 'jsonp',
		success:function(result){
			tag.meta = result.meta;
			tag.data = result.data;
			tag.pagination = result.pagination;
			callback();
  	}});
}

function proceedATagFormTagTable(tag, callback){

}

function likeAnImage(image, callback){
	//var url = 'https://api.instagram.com/v1/media/'+image.data.id+'/likes?access_token='+image.token;
	console.log('url');
	callback();
}

function getImages(){

	
	tags = tags[0];//tmp
	

	var url = {
		tag:'https://api.instagram.com/v1/tags/'+tags+'/media/recent?access_token='+token
	};
	
	
	$.ajax({
		url:url.tag,
		dataType: 'jsonp',
		success:function(result){
			log(url.tag);
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
function log(msg){
	$("#logs").append(msg+'<br />');
}

