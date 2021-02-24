<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Display Debug backtrace
|--------------------------------------------------------------------------
|
| If set to TRUE, a backtrace will be displayed along with php errors. If
| error_reporting is disabled, the backtrace will not display, regardless
| of this setting
|
*/
defined('SHOW_DEBUG_BACKTRACE') OR define('SHOW_DEBUG_BACKTRACE', TRUE);

/*
|--------------------------------------------------------------------------
| File and Directory Modes
|--------------------------------------------------------------------------
|
| These prefs are used when checking and setting modes when working
| with the file system.  The defaults are fine on servers with proper
| security, but you may wish (or even need) to change the values in
| certain environments (Apache running a separate process for each
| user, PHP under CGI with Apache suEXEC, etc.).  Octal values should
| always be used to set the mode correctly.
|
*/
defined('FILE_READ_MODE')  OR define('FILE_READ_MODE', 0644);
defined('FILE_WRITE_MODE') OR define('FILE_WRITE_MODE', 0666);
defined('DIR_READ_MODE')   OR define('DIR_READ_MODE', 0755);
defined('DIR_WRITE_MODE')  OR define('DIR_WRITE_MODE', 0755);

/*
|--------------------------------------------------------------------------
| File Stream Modes
|--------------------------------------------------------------------------
|
| These modes are used when working with fopen()/popen()
|
*/
defined('FOPEN_READ')                           OR define('FOPEN_READ', 'rb');
defined('FOPEN_READ_WRITE')                     OR define('FOPEN_READ_WRITE', 'r+b');
defined('FOPEN_WRITE_CREATE_DESTRUCTIVE')       OR define('FOPEN_WRITE_CREATE_DESTRUCTIVE', 'wb'); // truncates existing file data, use with care
defined('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE')  OR define('FOPEN_READ_WRITE_CREATE_DESTRUCTIVE', 'w+b'); // truncates existing file data, use with care
defined('FOPEN_WRITE_CREATE')                   OR define('FOPEN_WRITE_CREATE', 'ab');
defined('FOPEN_READ_WRITE_CREATE')              OR define('FOPEN_READ_WRITE_CREATE', 'a+b');
defined('FOPEN_WRITE_CREATE_STRICT')            OR define('FOPEN_WRITE_CREATE_STRICT', 'xb');
defined('FOPEN_READ_WRITE_CREATE_STRICT')       OR define('FOPEN_READ_WRITE_CREATE_STRICT', 'x+b');

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
defined('EXIT_SUCCESS')        OR define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR')          OR define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG')         OR define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE')   OR define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS')  OR define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') OR define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     OR define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE')       OR define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN')      OR define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      OR define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

defined('INTERNAL_SERVER_ERROR')                OR define('INTERNAL_SERVER_ERROR', "Internal Server Error");
defined('INVALID_REQUEST_METHOD_MESSAGE')       OR define('INVALID_REQUEST_METHOD_MESSAGE', "Invalid Request Method");
defined('VALIDATION_ERROR_MESSAGE')             OR define('VALIDATION_ERROR_MESSAGE', "Validation Error");
defined('CONSTANT_NOT_DEFINED')                 OR define('CONSTANT_NOT_DEFINED', "Constant is not defined");
defined('AUTH_EXPIRE')                          OR define('AUTH_EXPIRE', 1800);

/*
 |--------------------------------------------------------------------------
 | BASE_DATE
 |--------------------------------------------------------------------------
 |
 | This is defined as the starting day and time of the Marlboro Game.
 |
 | It will be compared to the current day and time to determine the 
 | highest level a player can play for a given day
 | 
 | Because of the comparing logic, this datetime should be set in UTC.
 | Which means that:
 |
 |  If you want to start the game on May 5, 2020 12:00 AM Philippine Standard Time,
 |  because of timezones, in UTC that is May 4, 2020 4:00 PM UTC. So you need to set
 |  the BASE_DATE constant to "2020-05-04T16:00:00Z"
 |
 */
defined('BASE_DATE')                    OR define('BASE_DATE', date(DATE_ISO8601, strtotime('2020-05-04T16:00:00Z')));


defined('MARLBORO_BASE_URL')            OR define('MARLBORO_BASE_URL', 'https://marlboro.coreproc.dev');
defined('CLIENT_ID')                    OR define('CLIENT_ID', 1);
defined('CLIENT_SECRET')                OR define('CLIENT_SECRET', 'LZcwBdON2PovTbDc6efiCUPae9rpAzgDTOmXpZQC');
defined('AUTH_USERNAME')                OR define('AUTH_USERNAME', 'oncue-staging');
defined('AUTH_PASSWORD')                OR define('AUTH_PASSWORD', 'CS7EMkTYDe3r');


