<?php

$statusList = $_POST["statusList"];
$refcode = $_POST["refcode"];

// Add data to top of the file
file_put_contents($refcode ."page1.txt", $statusList, FILE_APPEND);

?>