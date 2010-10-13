<?php

// generate a random salt
function AD_random_salt() {

  // 26 capital letters + 26 lowercase letters + 10 numerals = 62 characters
  // base 2 log of 62 possible characters = 5.95 bits of entropy per character
  $saAD_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // 5.95 bits/character x 22 characters = 131 bits of entropy
  $saAD_length = 22;

  $salt = "";
  for ($i = 0; $i < $saAD_length; $i++) {
    $salt .= $saAD_chars[rand(0, strlen($saAD_chars) - 1)];
  }

  return $salt;
}

// hash a password using a salt
function AD_hash_password($password, $salt) {
  return md5($salt . $password);
}

function AD_write_user_row($row) {
  // URL-encode strings to be decoded by javascript's decodeURIComponent.
  echo "  <user id=\"{$row['id']}"
    . "\" name=\"" . rawurlencode($row['name'])
    . "\" color=\"" . rawurlencode($row['color'])
    . "\" permissions=\"" . rawurlencode($row['permissions'])
    . "\"/>\n";
}

?>
