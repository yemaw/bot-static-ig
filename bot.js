var running = false;
var tags_table = [];
var tokens_table = [];


$(document).ready(function(){
	
	$("#reset_tokens").click(function(){if(running){return;}Cookies.set('tokens','[]');location.reload();});
	$("#reset_tags").click(function(){if(running){return;}Cookies.set('tags','[]');location.reload();});
	
	$("#save_tokens").click(function(){if(running){return;}setTokensTable();location.reload();});
	$("#save_tags").click(function(){if(running){return;}setTagsTable();location.reload();});
	
	$("#add_some_tags").click(function(){if(running){return;}$('#tags').val('cars\nmyanmar\ngoogle\nyangon\nmandalay\nscenery\nsunset');});

	$("#startbot").click(function(){
		startBot();
	});

	//prefill tokens from cookies
	var tokens = JSON.parse(Cookies.get('tokens'));
	for(var i=0; i<tokens.length; i++){
		$('input[name="tokens[]"]').get(i).value = tokens[i];
	}
	
	//prefill tags from cookies
	var tags = JSON.parse(Cookies.get('tags'));
	for(var i=0; i<tags.length; i++){
		var leading_new_line = (i === 0) ? '' : '\n';
		$("#tags").val($("#tags").val()+leading_new_line+tags[i]);
	}

});

function startBot(){
	
	if(isNaN(parseInt($("#interval_seconds").val()))){
		alert("Interval is Invilid");
		logText("Interval is Invilid");
		return;
	}

	setTokensTable();
	setTagsTable();

	if(tokens_table.length === 0 || tags_table.length === 0){
		logText("Can't start. Tags or tokens are invalid.");
		return;
	}



	var current = 0;
	async.eachSeries(tags_table, getImagesForATag, function(error){ //fill with images data into hash
		
		//all ok now disabling input fields
		disableInputs();
		
		async.forever(function(callback){
			if(tags_table[current].data.length === 0){
				logText('Tag::#'+tags_table[current].tag+'. Reaching end of list. Can not continue for this tag.');
				callback();
			}

			var tag = tags_table[current];
			var image = tags_table[current].data[0];

			likeAnImage(image,function(){
				
				updateStatusForNewLikedImage();

				tags_table[current].data.shift();
				if(tags_table[current].data.length <= 5){
					getImagesForATag(tags_table[current],function(){});
				}

				current = (current === tags_table.length-1) ? 0 : current+1;
				
				setTimeout(function(){
					callback();
				},getIntervalMS());
				
			});

		}, function(error){
			console.log(error);
		});
	
	});
	
}

function getImagesForATag(tag, callback){
	if(!tag.url){
		tag.url = 'https://api.instagram.com/v1/tags/'+tag.tag+'/media/recent?access_token='+getAToken();	
	}
	
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
	var url = 'https://api.instagram.com/v1/media/'+image.id+'/likes?access_token='+getAToken();
	
	$.ajax({
		url:'http://node.yemaw.me/get2post/get2post/get2post?url='+url,
		dataType: 'jsonp',
		success:function(result){
			
			logImage(image);
  			callback();

  		}, error:function(error){
  			
  			logImage(image);
  			callback();
  		}
  	});
}

var token_index = 0;
function getAToken(){
	token_index = (token_index === tokens_table.length-1) ? 0 : token_index+1;
	return tokens_table[token_index];
}

function getIntervalMS(){
	return parseInt($("#interval_seconds").val())*1000;
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

function disableInputs(){
	$("#startbot").val('Started').removeClass('btn-success').addClass('btn-disabled');
	$("#tags").attr('disabled','disabled');
	$(".token").attr('disabled','disabled');
}

var total_liked_count = 0;
function updateStatusForNewLikedImage(){
	total_liked_count++;
	$("#status").html('Total: '+total_liked_count);
}

function setTokensTable(){
	
	tokens_table = [];
	
	$('input[name="tokens[]"]').each(function(){
		if($(this).val()){
			tokens_table.push($(this).val());	
		}
	});

	Cookies.set('tokens', JSON.stringify(tokens_table));
}

function setTagsTable(){
	
	tags_table = [];

	//tags validation
	var tags = $("#tags").val().split("\n");
	if(tags.length === 0){
		alert('tags are empty');return;
	}
	
	for(var i=0; i<tags.length;i++){
		
		//single tag validation
		var tag = tags[i].trim();
		if(tag === undefined || tag === ''){
			logText('Tag invilid at index '+ (i+1));
			alert('Tag invilid at index '+(i+1)+'. Please correct.');
			return;
		}

		tags_table[i] = {tag:tag, data:[]}
	}
	var tags_only = [];
	for(var i=0; i<tags_table.length; i++){
		tags_only[i]=tags_table[i].tag;
	}
	Cookies.set('tags', JSON.stringify(tags_only));
}

