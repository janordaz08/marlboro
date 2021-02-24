<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Account extends CI_Controller {
    
    private $client;

	public function __construct() {
		parent::__construct();
		$this->load->library('ErrorLibrary');
	}
	
	public function getOAuth() {
	    $this->load->library('guzzle');
	    
	    $this->client = new \GuzzleHttp\Client();
	    $response = $this->client->post(MARLBORO_BASE_URL."/oauth/token", ['json' => [
	        'grant_type' => "password",
	        'client_id' => CLIENT_ID,
	        'client_secret' => CLIENT_SECRET,
	        'username' => AUTH_USERNAME,
	        'password' => AUTH_PASSWORD,
	        'scope' => ""
	    ]]);
		
	    $a = $response->getBody()->getContents();
	    
	    if(!$this->is_valid_json($a)) {
	        return null;
	    }
	    
	    return json_decode($a, true);
	}
	
	private function is_valid_json( $raw_json ){
	    return ( json_decode( $raw_json , true ) == NULL ) ? false : true ; // Yes! thats it.
	}
	
	public function getLevel() {	
	    $numberOfLevels = 40;
        $returnData = array();
	    $inputData = json_decode($this->input->raw_input_stream, true);
	    
	    if($inputData['user'] == null) {
	        $this->errorlibrary->throwException("There has been an error. Please try again.");
	    }
	    
	    $currentDateTime = date(DATE_ISO8601, now('UTC'));
	    
	    $user = $this->GenericModel->generic_select_one("SELECT * FROM user WHERE userToken = ?", $inputData['user']);
	    if($user == null) {
	        $this->GenericModel->generic_insert("user", array(
	            "userToken" => $inputData["user"],
	            "dateStarted" => $currentDateTime,
	            "dateUpdated" => $currentDateTime,
	            "currentLevel" => 1,
	            "repeatCount" => 0
	        ));
	        
	        $user = $this->GenericModel->generic_select_one("SELECT * FROM user WHERE userToken = ?", $inputData['user']);
	    }
	    
	    $baseDateOffset = strtotime($currentDateTime) - strtotime(BASE_DATE);
	    $maximumLevelDayOffset = floor($baseDateOffset / 86400);
	    //$maximumLevelDayOffset = $maximumLevelDayOffset % $numberOfLevels;
	    
	    if($maximumLevelDayOffset < 0) {
	        $returnData['r'] = 0;
	        $returnData['c'] = 0;
	        $returnData['n'] = 0;
	        $returnData['l'] = 0;
	        $returnData['s'] = 0;
	        $returnData['p'] = 0;
	        echo json_encode($returnData);
	        return;
	    }
	    
	    $mostRecentGame = $this->GenericModel->generic_select_one(
	        "SELECT 
                g.id, g.userId, g.levelId,
                DATE_FORMAT(g.dateStarted, '%Y-%m-%dT%H:%i:%sZ') dateStarted,
                DATE_FORMAT(g.dateFinished, '%Y-%m-%dT%H:%i:%sZ') dateFinished,
                g.completed, l.rowCount, l.colCount, l.puzzleCount, l.points, l.dayOffset
            FROM 
                game g
            JOIN 
                level l 
            ON  g.levelId = l.id 
            WHERE 
                userId = ? 
            ORDER BY STR_TO_DATE(dateStarted, '%Y-%m-%dT%H:%i:%s') DESC LIMIT 1",
        $user['id']);
	    
	    //no recent games in db, create new and return immediately
	    if($mostRecentGame == null) {
	        $this->GenericModel->generic_insert("game", array(
	            "userId" => $user['id'],
	            "levelId" => 1,
	            "dateStarted" => $currentDateTime,
	            "completed" => 0
	        ));
	        
	        $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE id = 1");
	        $returnData['r'] = (int) $levelData['rowCount'];
	        $returnData['c'] = (int) $levelData['colCount'];
	        $returnData['n'] = (int) $levelData['puzzleCount'];
	        $returnData['l'] = (int) $levelData['dayOffset'] + 1;
	        $returnData['s'] = 0;
	        $returnData['p'] = $levelData['points'];
	        echo json_encode($returnData);
	        return;
	        
	    }
	    
	    $mostRecentGameDayOffset = floor((strtotime($mostRecentGame['dateStarted']) - strtotime(BASE_DATE)) / 86400);
	    
// 	    $mostRecentGameDayOffset = $mostRecentGameDayOffset % $numberOfLevels;
	    
// 	    $mostRecentGame['dayOffset'] = $mostRecentGame['dayOffset'] % ($numberOfLevels -1);

        // if most recent game is completed
	    if($mostRecentGame['completed'] == true) {
            $mostRecentGameFinishedDayOffset = floor((strtotime($mostRecentGame['dateFinished']) - strtotime(BASE_DATE)) / 86400);
	        //check if most recent game level offset is the offset for previous day
            $maximumLevelDayOffset = $maximumLevelDayOffset % $numberOfLevels;
            if($maximumLevelDayOffset - 1 == $mostRecentGame['dayOffset']) {
	            //if yes, user is eligible for current day level, insert new game entry for current day level, return...
//                 if($maximumLevelDayOffset == $numberOfLevels) {
//                     $maximumLevelDayOffset = 0;
//                 }
                $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE dayOffset = ?", $maximumLevelDayOffset);
	            $this->GenericModel->generic_update("user", array("dateUpdated" => $currentDateTime, "currentLevel" => $levelData['id']), array("id" => $user['id']));
	            $this->GenericModel->generic_insert("game", array(
	                "userId" => $user['id'],
	                "levelId" => $levelData['id'],
	                "dateStarted" => $currentDateTime,
	                "completed" => 0
	            ));
	            
	        } else if($maximumLevelDayOffset - 1 > $mostRecentGame['dayOffset']) {
	            //if most recent completed game is for a previous day than other than yesterday, check if it is played yesterday
	            $mostRecentGameFinishedDayOffset = $mostRecentGameFinishedDayOffset % $numberOfLevels;
	            if($maximumLevelDayOffset - 1 >= $mostRecentGameFinishedDayOffset) {
	                //if played on any previous day other than today, insert new game, increment level by 1.
	                if($mostRecentGame['dayOffset'] == $numberOfLevels - 1) {
	                    $mostRecentGame['dayOffset'] = -1;
	                }
	                $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE dayOffset = ?", $mostRecentGame['dayOffset'] + 1);
	                $this->GenericModel->generic_update("user", array("dateUpdated" => $currentDateTime, "currentLevel" => $levelData['id']), array("id" => $user['id']));
	                $this->GenericModel->generic_insert("game", array(
	                    "userId" => $user['id'],
	                    "levelId" => $levelData['id'],
	                    "dateStarted" => $currentDateTime,
	                    "completed" => 0
	                ));
	            } else {
	                $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE dayOffset = ?", $mostRecentGame['dayOffset']);
	            }
	        } else {
	            //else most recent game played is for current day, return latest game
                $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE dayOffset = ?", $mostRecentGameDayOffset);
	        }
	        
	    } else {
	        $levelData = $this->GenericModel->generic_select_one("SELECT * FROM level WHERE dayOffset = ?", $mostRecentGame['dayOffset']);
	    }
	    
	    $returnData['r'] = (int) $levelData['rowCount'];
	    $returnData['c'] = (int) $levelData['colCount'];
	    $returnData['n'] = (int) $levelData['puzzleCount'];
	    $returnData['l'] = (int) $levelData['dayOffset'] + 1;
	    $returnData['s'] = (int) $mostRecentGame['completed'];
	    $returnData['p'] = (int) $levelData['points'];
	    echo json_encode($returnData);
	    
	    
	}
	
	function complete() {
	    $returnData = array();
	    $inputData = json_decode($this->input->raw_input_stream, true);
	    
	    if($inputData['user'] == null) {
	        $this->errorlibrary->throwException("There has been an error. Please try again.");
	    }
	    
	    $currentDateTime = date(DATE_ISO8601, now('UTC'));
	    
	    $user = $this->GenericModel->generic_select_one("SELECT * FROM user WHERE userToken = ?", $inputData['user']);
	    
	    if($user == null) {
            $this->errorlibrary->throwException("There has been an error. Please try again.");
	    }
	    
	    $mostRecentGame = $this->GenericModel->generic_select_one(
	        "SELECT
                g.id, g.userId, g.levelId,
                DATE_FORMAT(g.dateStarted, '%Y-%m-%dT%H:%i:%sZ') dateStarted,
                DATE_FORMAT(g.dateFinished, '%Y-%m-%dT%H:%i:%sZ') dateFinished,
                g.completed, l.rowCount, l.colCount, l.puzzleCount, l.points, l.dayOffset
            FROM
                game g
            JOIN
                level l
            ON  g.levelId = l.id
            WHERE
                userId = ?
            ORDER BY STR_TO_DATE(dateStarted, '%Y-%m-%dT%H:%i:%s') DESC LIMIT 1",
        $user['id']);
	    
	    if($mostRecentGame['completed'] == false) {
	        $auth = $this->getOAuth();
	        
	        $this->load->library('guzzle');
	        $this->client = new \GuzzleHttp\Client(['headers' => [
	            'Authorization' => "Bearer ".$auth["access_token"],
	            'Accept' => "application/json",
	            'Content-Type' => "application/json"
	        ]]);
	        
	        $response = $this->client->post(MARLBORO_BASE_URL."/api/game-transactions", ['json' => [
	            'game_reference_id' => $mostRecentGame["id"],
	            'amount' => $mostRecentGame["points"],
	            'spice_person_id' => $user["userToken"]
	        ]]);
	        
	        $a = $response->getBody()->getContents();
	        
	        $this->GenericModel->generic_update("game", array("dateFinished" => $currentDateTime, "completed" => 1), array("id" => $mostRecentGame['id']));
	        return;
	    }
	    
	    return;
	}
	
	
}
