<?php

$statusList = $_POST["statusList"];

$posts = $username; 
foreach($statusList as $s){
	$posts .= $s;
}
// Add data to top of the file
file_put_contents("new.txt", $posts, FILE_APPEND);

?>