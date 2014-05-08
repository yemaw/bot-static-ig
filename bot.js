
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

    		for(var i=0; i<images.length; i++){
    			$("#logs").append(images[i].id + '<img style="width:40px;height:40px;" src="' + images[i].images.low_resolution.url + '" />');
    		}
  	}});

});

});
