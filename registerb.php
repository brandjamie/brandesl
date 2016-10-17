<?

    // require common code
    require_once("common.php");

    // log out current user (if any)
//  logout();

$stunum = mysql_real_escape_string($_GET["num"]);



$htmlstring = '
<!DOCTYPE html 
     PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
     "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
  <title>BrandEsl</title>
<link type="text/css" rel="stylesheet" href="css/style2.css">
</head>
<body>

  
<div id="upper">
<div id="header">
<div id="title">
<h1>BrandEsl</h1>
</div>
</div>
</div>

<div id="main">
<div id="leftcol">
	<div class="post">
	<div class="postframe">
		<div id="portfolio" class="content">
		<h2>New User? Please register</h2>
		 <div align="center">
      <form action="register2.php" method="post">
        <table border="0">
          <tr>
            <td class="field">Student Number:</td>
        <td><input name="stunum" type="text" value ="';

$htmlstring = $htmlstring.$stunum;
$htmlstring = $htmlstring.'" />
          </td>
          </tr>
          <tr>
            <td class="field">Name</td>
            <td><input name="stuname" type="text" /></td>
          </tr>
        </table>
        <div style="margin: 10px;">
          <input type="submit" value="Register" />
        </div>
        <div style="margin: 10px;">
          Already a member? <a href="login.php">Login</a>
        </div>
      </form>
    </div>
		
	</div>

	
</div>
</div>
</div>

</div>



   

   

  </body>

</html>
           ';
echo $htmlstring;
?>