var tags_table = [];

var images = [];
var count = 0; //tmp

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

	tags_table = []; //reset the global hash table

	//initialize hash with tags
	for(var i=0; i<tags.length;i++){
		var url = 'https://api.instagram.com/v1/tags/'+tags[i]+'/media/recent?access_token='+getAToken()
		tags_table[i] = {tag:tags[i].trim(), url:url, data:[]}
	}
	var current = 0;
	
	async.eachSeries(tags_table, getImagesForATag, function(error){ //fill with images data into hash
		//all filled with images data. 
		
		
		async.forever(function(callback){
			

			var tag = tags_table[current];
			var image = tags_table[current].data[0];

			likeAnImage(image,function(){

				tags_table[current].data.shift();
				if(tags_table[current].data.length < 3){
					getImagesForATag(tags_table[current],function(){});
				}


				current = (current === tags_table.length-1) ? 0 : current+1;
				
				//tag.current_index = (tag.current_index === tag.current_index.lenght-1) ? 0 : tag.current_index+1;
				
				setTimeout(function(){
					callback();
				},1000);
				
			});

		}, function(error){
			console.log(error);
		});
	
	});
	
}

function getImagesForATag(tag, callback){
	
	$.ajax({
		url:tag.url,
		dataType: 'jsonp',
		success:function(result){
			
			tag.meta = result.meta;
			for(var i=0; i<result.data.length; i++){
				tag.data.push(result.data[i]);
			}
			tag.pagination = result.pagination;
			
			tag.url = result.pagination.next_url;

			logText('Tag::#'+tag.tag+ '. Loaded '+result.data.length+" new images. Total "+tag.data.length+' in queue.');
			callback();
  	}});
}


function likeAnImage(image, callback){
	var url = 'https://api.instagram.com/v1/media/'+image.id+'/likes?access_token='+Cookies.get('token');
	
	$.ajax({
		url:'http://node.yemaw.me/get2post/get2post/get2post?url='+url,
		dataType: 'jsonp',
		success:function(result){
			
			logImage(image);
  			$("#status").html("total liked = "+count);
    		callback();

  		}, error:function(error){
  			
  			logImage(image);
  			$("#status").html("total liked = "+count);
    		callback();
  		}
  	});
}

function getAToken(){
	return Cookies.get('token');
}

function logText(msg){
	if($('#console_log_on').is(':checked')){
		$("#console_logs").append(msg+'<br />');
	}
}

function logImage(image){
	if($('#img_log_on').is(':checked')){
		$("#imgs_logs").append('<a href="' + image.link + '" target="_blank"><img src="'+image.images.low_resolution.url+'" /></a>');	
	}	
}

/**/
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


