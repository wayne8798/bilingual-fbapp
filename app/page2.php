<?php
$Q1 = $_POST["Q1"];
$Q2 = $_POST["Q2"];
$Q3b = $_POST["Q3b"];
$audience = $_POST["audience"];
$audienceOther = $_POST["audienceOther"];
$obligated = $_POST["obligated"];
$comfortable = $_POST["comfortable"];
$langChoice = $_POST["langChoice"];
$langOther = $_POST["langOther"];
$langChoiceKorean = $_POST["langChoiceKorean"];
$langOtherKorean = $_POST["langOtherKorean"];
$postNo = $_POST["postNo"];

$posts = "\nPost " . $postNo . " \n";
$posts .= "1. Do you remember posting this message? ".$Q1." \n";
$posts .= "2. Do you remember the intended audience? ".$Q2." \n";
$posts .= "3. If so, who were they? (Select all that apply) \n";
if ($audience){
	foreach ($audience as $a) {
	$posts .= $a." \n";
	}
}

$posts .= $audienceOther." \n";

$posts .= "3b. Would you mind if people who weren’t your intended audience saw the message? ".$Q3b." \n";

$posts .= "3c. On the scale from 1 to 5, how obligated did you feel to write in English for this audience? ".$obligated." \n";

$posts .= "4. Why did you write this post in English?\n";

if ($langChoice){
	foreach ($langChoice as $l) {
	$posts .= $l."\n";
	}
}
$posts .= $langOther." \n";

$posts .= "4b. Why did you write part of this post in Korean?\n";

if ($langChoiceKorean){
	foreach ($langChoiceKorean as $l) {
	$posts .= $l."\n";
	}
}
$posts .= $langOtherKorean." \n";

$posts .= "5. How comfortable would you feel if your American friend read this post using the translation tool on Facebook? ".$comfortable." \n";

// Add data to top of the file
file_put_contents("page2.txt", $posts, FILE_APPEND);

//redirect
//if the last post
if ((int)$postNo == 6 ){
	header('Location: ' . "../viz/index.html");
} else {
$url = 'page2.html#post=' . (string)((int)$postNo + 1);
header('Location: ' . $url);
}


?>
