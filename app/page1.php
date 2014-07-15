<?php

$statusList = $_POST["statusList"];
$statusNo = $_POST["statusNo"];
$refcode = $_POST["refcode"];

// Add data to top of the file
file_put_contents($refcode ."-page1.txt", $statusNo . ". ".$statusList, FILE_APPEND);

?>