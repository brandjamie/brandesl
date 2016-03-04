\<?

    // require common code
        require_once("common.php"); 

    // escape username and password for safety
    $stunum = mysql_real_escape_string($_POST["stunum"]);
    // prepare SQL
    $sql = "SELECT uid, student_name, student_number FROM users WHERE student_number='$stunum'";

    // execute query
    $result = mysql_query($sql);

    // if we found a row, remember user and redirect to portfolio
    if (mysql_num_rows($result) == 1)
    {
        // grab row
        $row = mysql_fetch_array($result);
        // cache uid in session
        $_SESSION["uid"] = $row["uid"];
	     $_SESSION["student_number"] = $row["student_number"];
         $_SESSION["student_name"] = $row["student_name"];
       // redirect to main quiz
        redirect("index.php");
    }

    // else report error
    else
    {
          redirect("registerb.php");
    }
?>
