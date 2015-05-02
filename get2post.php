<?php if(isset($_GET['url'])) { 
	
	$url = parse_url(urldecode($_GET['url']));
	$path_url = explode('?',$_GET['url'])[0];
	
	$data = array();
	foreach(explode("&", $url['query']) AS $pair) 
	{ 
		$parts = explode('=', $pair);
		$data[$parts[0]] = $parts[1];
	}
	
	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($path_url, false, $context);
	
	//var_dump($data);
	//var_dump($path_url);
	echo json_encode($result);
}
  ?>