<?

    // require common code
    require_once("common.php"); 

    // escape username and password for safety
    $stunum = mysql_real_escape_string($_POST["stunum"]);
    $stuname = mysql_real_escape_string($_POST["stuname"]);
    
    if (!$stunum||!$stuname)
    {
    	apologize("One or more fields was blank!");
    	}
    // prepare SQL
    $sql = "INSERT INTO users (student_number, student_name) VALUES ('$stunum','$stuname')";

    // execute query
    $result = mysql_query($sql);
  
   if ($result == 1){
   	 $sql = "SELECT uid FROM users WHERE student_number = '$stunum'";
   	  $result = mysql_query($sql);
      $row = mysql_fetch_array($result);

        // cache uid in session
        $_SESSION["uid"] = $row["uid"];
	     $_SESSION["student_number"] = $row["student_number"];
         $_SESSION["student_name"] = $row["student_name"];
        // redirect to main quiz
        redirect("index.php");
    }
    	else 
   	{
    	apologize("Student number taken!");
    	}
   
 ?>
