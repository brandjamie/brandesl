<?

    // require common code
    require_once("common.php");

    // log out current user (if any)
    logout();

?>

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
<h1>BrandJamieEsl</h1>
</div>
</div>
</div>

<div id="main">
<div id="leftcol">
	<div class="post">
	<div class="postframe">
		<div id="portfolio" class="content">
		<h2>Login</h2>
		<div align="center">
      <form action="login2.php" method="post">
        <table border="0">
          <tr>
            <td class="field">Student Number:</td>
            <td><input name="stunum" type="text" /></td>
          </tr>
         
        </table>
        <div style="margin: 10px;">
          <input type="submit" value="Log In" />
        </div>
        <div style="margin: 10px;">
          or <a href="register.php">register</a> for an account
        </div>
      </form>
    </div>
		
	</div>

	
</div>
</div>
</div>

</div>
</div>



   

   

  </body>

</html>



















  
