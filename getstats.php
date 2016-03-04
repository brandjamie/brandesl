<?

require_once("common.php");

$userid = $_POST[uid];

$sql = "SELECT * FROM userstats WHERE userid='$userid'";


$result = mysql_query($sql);
$data = array();
while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
    $currrow = array();
    if (!array_key_exists($row['unit'],$data)) {
            $data[$row['unit']] = array();
        }
    //   $currrow['ex'] = $row['ex'];
    $currrow['locked'] = $row['locked'];
    $currrow['numcorrect'] = $row['numcorrect'];
    $currrow['numanswers'] = $row['numanswers'];
    $currrow['beststreak'] = $row['beststreak'];
    $currrow['currentstreak'] = $row['currentstreak'];
    $data[$row['unit']][$row['ex']] = $currrow;
      }

 
echo json_encode($data);


?>

