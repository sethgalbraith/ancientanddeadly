<?php

if (file_exists('db_config.php')) die ("Live Tabletop is already installed.");

include('include/users.php');
include('include/query.php');


// Interpret the Request

$location = $_REQUEST['location'];
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$database = $_REQUEST['database'];

$AD_SQL = new mysqli($location , $username , $password, $database);
if ($AD_SQL->connect_errno != 0) die('Could not connect.');

$admin_username = $AD_SQL->real_escape_string($_REQUEST['admin_username']);
$admin_password = $AD_SQL->real_escape_string($_REQUEST['admin_password']);


// Create the Database Schema (tables and stored procedures)

$AD_SQL->autocommit(FALSE);
if ($AD_SQL->multi_query(file_get_contents('include/schema.sql'))) {
  do {
    $result = $AD_SQL->store_result();
    if ($AD_SQL->errno != 0) {
      $AD_SQL->rollback();
      die("Query failed: " . $AD_SQL->error);
    }
  } while ($AD_SQL->next_result());
  $AD_SQL->commit();
}
else {
  $AD_SQL->rollback();
  die("Query failed: " . $AD_SQL->error);
}


// Create an Administrator Account

$salt = AD_random_salt();
$hash = AD_hash_password($admin_password, $salt);
$query = "CALL create_user('$admin_username', '$hash', '$salt', NULL, 'administrator')";
$AD_SQL->query($query) or die('Query failed: ' . $AD_SQL->error);


// Create db_config.php

file_put_contents('db_config.php',
  "<?php\n"
  . "  \$AD_SQL = new mysqli('$location', '$username', '$password', '$database');\n"
  . "?>\n");


?>

