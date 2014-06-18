Hi <?php echo htmlspecialchars($_POST['name']); ?>.
You are <?php echo (int)$_POST['age']; ?> years old.


<?php
$file = 'people.txt';
// Open the file to get existing content
$current = '';
// Append a new person to the file
$current .= $_POST['name'];
// Write the contents back to the file
file_put_contents($file, $current);
?>