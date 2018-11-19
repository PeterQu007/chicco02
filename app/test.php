<?php 
if (isset($_POST["postTitle"]))
{
  $title = $_POST["postTitle"];
  echo $title;
  echo " is your tab title";
} 
else 
{
  $title = null;
  echo "no username supplied";
}

if (isset($_POST["postID"]))
{
  $ID = $_POST["postID"];
  echo $ID;
  echo " is your tab id";
} 
else 
{
  $ID = null;
  echo "no username supplied";
}

?>

<div > <?php echo $title . $ID ?> </div>