<?
  // display errors and warnings but not notices
    ini_set("display_errors", true);
    error_reporting(E_ALL ^ E_NOTICE);

    // enable sessions, restricting cookie to /~username/pset7/
    if (preg_match("{^(/~[^/]+/pset7/)}", $_SERVER["REQUEST_URI"], $matches))
        session_set_cookie_params(0, $matches[1]);
    session_start();


    // require authentication for most pages
    if (!preg_match("/(:?log(:?in|out)|register)\d*\.php$/", $_SERVER["PHP_SELF"]))
    {
        if (!isset($_SESSION["uid"]))
            redirect("login.php");
    }

    // ensure database's name, username, and password are defined
    // your database's name (i.e., username_pset7)
    define("DB_NAME", "db_name");

    // your database's username
    define("DB_USER", "username");

    // your database's password
    define("DB_PASS", "password");

    // hostname of course's database server
    define("DB_SERVER", "db_server");

    // connect to database server
    if (($connection = @mysql_connect(DB_SERVER, DB_USER, DB_PASS)) === FALSE)
        apologize("Could not connect to database server (" . DB_SERVER . "). ");

    // select database
    if (@mysql_select_db(DB_NAME, $connection) === FALSE)
        apologize("Could not select database (" . DB_NAME . ").");

    function redirect($destination)
    {
        // handle URL
        if (preg_match("/^http:\/\//", $destination))
            header("Location: " . $destination);

        // handle absolute path
        else if (preg_match("/^\//", $destination))
        {
            $host = $_SERVER["HTTP_HOST"];
            header("Location: http://$host$destination");
        }

        // handle relative path
        else
        {
            // adapted from http://www.php.net/header
            $host = $_SERVER["HTTP_HOST"];
            $path = rtrim(dirname($_SERVER["PHP_SELF"]), "/\\");
            header("Location: http://$host$path/$destination");
        }

        // exit immediately since we're redirecting anyway
        exit;
    }

    /*
     * void
     * logout()
     *
     * Logs out current user (if any).  Based on Example #1 at
     * http://us.php.net/manual/en/function.session-destroy.php.
     */

    function logout()
    {
        // unset any session variables
        $_SESSION = array();

        // expire cookie
        if (isset($_COOKIE[session_name()]))
        {
            if (preg_match("{^(/~[^/]+/pset7/)}", $_SERVER["REQUEST_URI"], $matches))
                setcookie(session_name(), "", time() - 42000, $matches[1]);
            else
                setcookie(session_name(), "", time() - 42000);
        }

        // destroy session
        session_destroy();
    }

    /*
     * void
     * apologize($message)
     *
     * Apologizes to user by displaying a page with message.
     */

    function apologize($message)
    {
        // require template
        require_once("apology.php");

        // exit immediately since we're apologizing
        exit;
    }

?>
