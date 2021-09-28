<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  echo '<pre>' , var_dump($_POST) , '</pre>';

  // lead to another page here
} else {
  include './index.html';
}