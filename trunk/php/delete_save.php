<?php

session_start();

include('db_config.php');
include('include/query.php');
include('include/ownership.php');

// Interpret the Request

$save_id = $AD_SQL->real_escape_string($_REQUEST['save_id']);

// Query the Database

if (AD_can_modify_save($save_id)) {
  AD_call('delete_savee', $save_id);
}

?>
