<?php

define('DATABASE', 'tryout');
define('USERNAME', 'root');
define('PASSWORD', 'root');

/**
 * Parse Manually Session Data CodeIgniter to Array
 * @param String
 * @return Array
 */
if(! function_exists('sessionToArray')) {
	function sessionToArray($data) {
		if(strlen($data) == 0)
			return [];
		preg_match_all('/(^|;|\})([a-zA-Z0-9_]+)\|/i', $data, $matchesArray, PREG_OFFSET_CAPTURE);
	 	$returnArray = array();
		$lastOffset = null;
		$currentKey = '';
		foreach($matchesArray[2] as $value) {
			$offset = $value[1];
			if(!is_null($lastOffset)) {
				$valueText = substr($data, $lastOffset, $offset - $lastOffset);
				$returnArray[$currentKey] = unserialize($valueText);
			}
			$currentKey = $value[0];
			$lastOffset = $offset + strlen($currentKey) + 1;
		}
		$valueText = substr($data, $lastOffset);
		$returnArray[$currentKey] = unserialize($valueText);
		return $returnArray;
	}
}

$dsn = 'mysql:dbname='.DATABASE.';host=localhost';
try {
    $dbh = new PDO($dsn, USERNAME, PASSWORD);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
// Get Cookie
// $session_id = $_COOKIE['_sessions'];
// $query = $dbh->prepare("SELECT data FROM `_sessions` WHERE id=:param");
// $query->bindParam(':param', $session_id);
// $query->execute();
// $result = $query->fetch();
// $session_data = sessionToArray($result['data']);
// if(!$session_data['is_logged_in']) {
// 	header('Location: '.$config['base_url']);
// }