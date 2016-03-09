<?

//////////////////////////// from common.php ////////////////
   // your database's name (i.e., username_pset7)
define("DB_NAME", "brandesl");

    // your database's username
define("DB_USER", "brandjamie");

    // your database's password
define("DB_PASS", "ci8zez0x");

    // hostname of course's database server
define("DB_SERVER", "mysimtence.db");


    // connect to database server
if (($connection = @mysql_connect(DB_SERVER, DB_USER, DB_PASS)) === FALSE)
    apologize("Could not connect to database server (" . DB_SERVER . "). ");

    // select database
if (@mysql_select_db(DB_NAME, $connection) === FALSE)
    apologize("Could not select database (" . DB_NAME . ").");


function apologize($message)
{
    // require template
    require_once("apology.php");
    
    // exit immediately since we're apologizing
    exit;
}

/////////////////////////////////////////////////////
$section = 18;
$sql = "SELECT * FROM userstats INNER JOIN users ON userstats.userid=users.uid WHERE users.section='$section'";

//$sql = "SELECT * FROM userstats";

//$sql = "SELECT * FROM userstats INNER JOIN users ON userstats.userid=users.uid";


echo $sql;
$result = mysql_query($sql);


// loop through rows
while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {

    echo $row;

     $newname = $row['student_name'];
     $unit = $row['unit'];
     $ex = $row['ex'];
     $newuserexercise = "$newname$unit".ex."$ex";
     $olduserexercise = $row['userexercise'];
     $sql = "UPDATE userstats SET user='$newname', userexercise='$newuserexercise' WHERE userexercise='$olduserexercise'"; 

 $newresult = mysql_query($sql);


}



?>