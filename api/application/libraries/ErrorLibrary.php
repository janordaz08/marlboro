<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ErrorLibrary {

	public function throwException($message = INTERNAL_SERVER_ERROR, $httpStatus = 500) {
		http_response_code($httpStatus);
		if(is_array($message)) {
			echo json_encode($message);
		} else {
			echo ($message);
		}
		die();
	}
}