<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migrations extends CI_Controller {

	public function index() {
		$this->users();
		$this->levels();
		$this->list_of_values();
		$this->cars();
		$this->accessories();
		$this->sessions();
		$this->captcha();
		$this->create_log_field();
	}

	/**
	 * Users
	 */
	private function users() {
		$this->db->query("DROP TABLE IF EXISTS `users`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `users` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`full_name` VARCHAR(150) NOT NULL,
				`birth_date` DATE NULL,
				`email` VARCHAR(150) NOT NULL,
				`password` VARCHAR(150) NOT NULL,
				`address` VARCHAR(150) NOT NULL,
				`phone` VARCHAR(50) NULL,
				`user_type` ENUM('super_user', 'admin', 'user') NOT NULL DEFAULT 'admin',
				`activation_key` VARCHAR(100) NULL,
				`is_active` ENUM('true', 'false') DEFAULT 'true',
				`last_logged_in` DATETIME NULL,
				`ip_address` VARCHAR(45) NULL,
				UNIQUE `email` (`email`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * USER LEVELS
	 */
	private function levels() {
		$this->db->query("DROP TABLE IF EXISTS `levels`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `levels` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`name` VARCHAR(255) NOT NULL,
				`note` VARCHAR(255) NULL,
				UNIQUE `name` (`name`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * LIST OF VALUES
	 */
	private function list_of_values() {
		$this->db->query("DROP TABLE IF EXISTS `list_of_values`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `list_of_values` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`code` varchar(50) NULL,
				`name` varchar(50) NULL,
				`type` varchar(50) NULL,
				`is_default` BOOLEAN NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * CARS
	 */
	private function cars() {
		$this->db->query("DROP TABLE IF EXISTS `cars`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `cars` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`name` VARCHAR(255) NOT NULL,
				`vendor` VARCHAR(50) NULL,
				`model` VARCHAR(100) NULL,
				`type` VARCHAR(50) NULL,
				`color` VARCHAR(50) NULL,
				`price` bigint(20) NULL,
				`stock` bigint(20) NULL,
				`picture` VARCHAR(255) NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * ACCESSORIES
	 */
	private function accessories() {
		$this->db->query("DROP TABLE IF EXISTS `accessories`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `accessories` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`name` VARCHAR(255) NOT NULL,
				`category` VARCHAR(50) NULL,
				`vendor` VARCHAR(50) NULL,
				`car` VARCHAR(50) NULL,
				`stock` VARCHAR(50) NULL,
				`note` VARCHAR(255) NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * ORDERS
	 */
	private function orders() {
		$this->db->query("DROP TABLE IF EXISTS `orders`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `orders` (
				`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
				`user_id` VARCHAR(255) NOT NULL,
				`car_id` VARCHAR(255) NULL,
				`accesories_id` VARCHAR(255) NULL,
				`qty` VARCHAR(255) NULL,
				`total_price` VARCHAR(255) NULL,
				`note` VARCHAR(255) NULL
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * Sessions
	 */
	private function sessions() {
		$this->db->query("DROP TABLE IF EXISTS `_sessions`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `_sessions` (
				`id` varchar(128) NOT NULL,
	        `ip_address` varchar(45) NOT NULL,
	        `timestamp` int(10) unsigned DEFAULT 0 NOT NULL,
	        `data` blob NOT NULL,
				KEY `ci_sessions_timestamp` (`timestamp`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * Captcha
	 */
	private function captcha() {
		$this->db->query("DROP TABLE IF EXISTS `_captcha`");
		$this->db->query("CREATE TABLE _captcha (
				captcha_id BIGINT(13) unsigned NOT NULL auto_increment,
				captcha_time INT(10) unsigned NOT NULL,
				ip_address VARCHAR(45) NOT NULL,
				word VARCHAR(20) NOT NULL,
				PRIMARY KEY `captcha_id` (`captcha_id`),
				KEY `word` (`word`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8"
		);
	}

	/**
	 * Create Log Tables
	 */
	private function create_log_field() {
		$this->load->dbforge();
		foreach ($this->db->list_tables() as $table) {
			if (substr($table, 0, 5) !== 'view_' AND $table != '_sessions' AND $table != '_captcha') {
				if (!$this->db->field_exists('created_at', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
				}

				if (!$this->db->field_exists('updated_at', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `updated_at` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'");
				}

				if (!$this->db->field_exists('deleted_at', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `deleted_at` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'");
				}

				if (!$this->db->field_exists('restored_at', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `restored_at` TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'");
				}

				if (!$this->db->field_exists('created_by', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `created_by` bigint(20) DEFAULT NULL");
				}

				if (!$this->db->field_exists('updated_by', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `updated_by` bigint(20) DEFAULT NULL");
				}

				if (!$this->db->field_exists('deleted_by', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `deleted_by` bigint(20) DEFAULT NULL");
				}

				if (!$this->db->field_exists('restored_by', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `restored_by` bigint(20) DEFAULT NULL");
				}

				if (!$this->db->field_exists('is_deleted', $table)) {
					$this->db->query("ALTER TABLE " . $table . " ADD `is_deleted` ENUM('true','false') DEFAULT 'false'");
				}
			}
		}
	}

}
