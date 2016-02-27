<?
    // require common code
    require_once("common.php");

?>

<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>BrandEsl</title>
  <meta name="BrandEsl" content="Elementary English">
  <meta name="author" content="Jamie Brand">

  <link rel="stylesheet" href="css/styles.css?v=1.0">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
 


</head>

<body>
  <div id="upper">
    <div id="header">
      <div id="title">
	<h1>BrandEsl</h1>
      </div>
    </div>
          <div id="userinfo">
	    <?php echo $_SESSION["student_name"]; ?></br>
	    <?php echo $_SESSION["student_number"]; ?>
	</div>

  </div>
<div id="main"></div>

    <script src="js/jquery-1.12.0.min.js"></script>
    <script type="text/javascript">
         
    student_name='<?php echo $_SESSION["student_name"]; ?>';
    student_number=<?php echo $_SESSION["student_number"]; ?>;
    uid= <?php echo $_SESSION["uid"]; ?> ;


      </script>
 <script src="js/qscript.js"></script>


</body>
</html>
