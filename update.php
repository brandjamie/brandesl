<?

require_once("common.php");

function sanitize($str, $quotes = ENT_NOQUOTES){
   $str = htmlspecialchars($str, $quotes);
   return $str;
}
 

$userid = $_POST[uid];
$username = sanitize($_POST[name]);
$studentnum = sanitize($_POST["studentnum"]);
$unit = $_POST["unit"];
$ex = $_POST["ex"];
$locked = $_POST["locked"];
$numcorrect = $_POST["numcorrect"];
$currentstreak = $_POST["currentstreak"];
$beststreak = $_POST["beststreak"];
$numanswers = $_POST["numanswered"];

$index = "$username$unit".ex."$ex";

$sql = "SELECT * FROM userstats WHERE userexercise='$index'";


$result = mysql_query($sql);

if (mysql_num_rows($result) == 0) {

  $sql = "INSERT INTO userstats (userexercise, user, studentnum, userid, unit, ex, locked, numcorrect, numanswers, beststreak, currentstreak) VALUES ('$index','$username','$studentnum','$userid','$unit','$ex','$locked','$numcorrect','$numanswers','$beststreak','$currentstreak')";

} else {
$sql = "UPDATE userstats SET locked='$locked', numcorrect='$numcorrect', currentstreak='$currentstreak', beststreak='$beststreak', numanswers='$numanswers' WHERE userexercise='$index'";



}
$result = mysql_query($sql);


if ($result !=1) {

    	apologize("table not created   ".$sql);


} else {

  echo json_encode(array());
}

?>

