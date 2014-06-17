<?php
$Q1 = $_POST["Q1"];
$Q2 = $_POST["Q2"];
$audience = $_POST["audience"];
$audienceOther = $_POST["audienceOther"];
$langChoice = $_POST["langChoice"];
$langOther = $_POST["langOther"];
$postNo = $_POST["postNo"];

$posts = "\nPart " . $postNo . " \n";
$posts .= "1. Do you remember posting this message? ".$Q1." \n";
$posts .= "2. Do you remember the intended audience? ".$Q2." \n";

$posts .= "3. If so, who were they? (Select all that apply) \n";
if ($audience){
	foreach ($audience as $a) {
	$posts .= $a." \n";
	}
}
$posts .= $audienceOther." \n";

$posts .= "4. Why did you write this post in English?\n";

if ($langChoice){
	foreach ($langChoice as $l) {
	$posts .= $l."\n";
	}
}
$posts .= $langOther." \n";

// Add data to top of the file
file_put_contents("posts.txt", $posts, FILE_APPEND);

//redirect
//if the last post
if ((int)$postNo > 2){
	header('Location: ' . "page3.html");
} else {
$url = 'page2.html#post=' . (string)((int)$postNo + 1);
header('Location: ' . $url);
}


?>
