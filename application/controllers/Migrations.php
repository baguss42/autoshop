<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Migrations extends CI_Controller {

	public function index() {
		$this->users();
		$this->levels();
		$this->list_of_values();
		$this->cars();
		$this->accesories();
		$this->sessions();
		$this->captcha();
		$this->create_log_field();
		// $this->prepare_data();
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
	 * TRYOUT LEVELS
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
	 * SUBJECTS SETTINGS
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
	 * CLASSES
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
	 * MAJORS
	 */
	private function accesories() {
		$this->db->query("DROP TABLE IF EXISTS `accesories`");
		$this->db->query("CREATE TABLE IF NOT EXISTS `accesories` (
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
	 * SUBJECTS
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

	/**
	 * Create Dummy Data
	 * @return Void
	 */
	public function prepare_data() {
		require_once APPPATH .'third_party/autoload.php';
		$faker = Faker\Factory::create();

		// Classes
		$classes = ['X', 'XI', 'XII'];
		$fill_data = [];
		foreach ($classes as $value) {
			$fill_data[] = [
				'name' => $value,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('classes');
		$this->db->insert_batch('classes', $fill_data);

		// Levels
		$levels = ['Easy', 'Intermediate', 'Advance'];
		$fill_data = [];
		foreach ($levels as $value) {
			$fill_data[] = [
				'name' => $value,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('levels');
		$this->db->insert_batch('levels', $fill_data);

		// Majors
		$majors = ['IPA', 'IPS', 'Bahasa'];
		$fill_data = [];
		foreach ($majors as $value) {
			$fill_data[] = [
				'name' => $value,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('majors');
		$this->db->insert_batch('majors', $fill_data);

		// Subjects
		$subjects = ['Matematika (IPA)', 'Matematika (IPS)', 'Bahasa Inggris'];
		$fill_data = [];
		foreach ($subjects as $value) {
			$fill_data[] = [
				'name' => $value,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('subjects');
		$this->db->insert_batch('subjects', $fill_data);

		// Tryout Types
		$tryout_types = ['Tryout I', 'Tryout II', 'Tryout III'];
		$fill_data = [];
		foreach ($tryout_types as $value) {
			$fill_data[] = [
				'name' => $value,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('tryout_types');
		$this->db->insert_batch('tryout_types', $fill_data);

		// Scholars
		$scholars = ['Scholar I', 'Scholar II', 'Scholar III'];
		$fill_data = [];
		foreach ($scholars as $key => $value) {
			$fill_data[] = [
				'name' => $value,
				'nominal' => 1500000 * ($key + 1),
				'year' => date('Y') + $key,
				'note' => str_replace('.', '', $faker->sentence($nbWords = 3, $variableNbWords = true))
			];
		}
		$this->db->truncate('scholars');
		$this->db->insert_batch('scholars', $fill_data);

		// Tryout Settings
		$years = ['2016', '2017', '2018'];
		$tryout_types = $this->db->select('id')->get('tryout_types');
		$levels = $this->db->select('id')->get('levels');
		$fill_data = [];
		foreach ($years as $year) {
			foreach($tryout_types->result() as $tryout_type) {
				foreach ($levels->result() as $level) {
					$fill_data[] = [
						'year' => $year,
						'tryout_type_id' => $tryout_type->id,
						'level_id' => $level->id,
						'duration' => 120,
						'start_date' => $year.'-12-01',
						'end_date' => $year.'-12-31',
					];
				}
			}
		}
		$this->db->truncate('tryout_settings');
		$this->db->insert_batch('tryout_settings', $fill_data);

		// Dummy Users
		$fill_data = [];
		for($i = 1; $i <= 100; $i++) {
			$fill_data[] = [
				'full_name' => $faker->name,
				'birth_place' => $faker->city,
				'birth_date' => $faker->date('Y-m-d'),
				'email' => $faker->email,
				'password' => password_hash('123', PASSWORD_BCRYPT),
				'address' => $faker->address,
				'city' => $faker->city,
				'graduation_year' => 2016,
				'phone' => $faker->tollFreePhoneNumber,
				'city' => $faker->city,
				'province' => $faker->city,
				'postal_code' => $faker->postcode,
				'school' => $faker->streetName,
				'activation_key' => sha1($faker->email . $i),
				'class_id' => 1,
				'major_id' => 1,
				'scholar_id' => null,
				'is_active' => 'true',
				'user_type' => 'student'
			];
		}
		$this->db->truncate('users');
		$this->db->insert_batch('users', $fill_data);

		// Super Users
		$fill_data = [
			'password' => password_hash('softdev', PASSWORD_BCRYPT),
			'full_name' => 'SoftDev',
			'email' => 'pu-softdev@googlegroups.com',
			'user_type' => 'super_user',
			'activation_key' => sha1(md5('administrator'.time())),
			'is_active' => 'true'
		];
		$this->db->insert('users', $fill_data);

		// Question Banks
		$subjects = $this->db->select('id')->get('subjects');
		$levels = $this->db->select('id')->get('levels');
		$fill_data = [];
		foreach ($subjects->result() as $subject) {
			foreach ($levels->result() as $level) {
				for ($i=1; $i <= 20 ; $i++) {
					$fill_data[] = [
						'subject_id' => $subject->id,
						'level_id' => $level->id,
						'question' => str_replace('.', '', $faker->sentence($nbWords = 6, $variableNbWords = true))
					];
				}
			}
		}
		$this->db->truncate('question_banks');
		$this->db->insert_batch('question_banks', $fill_data);

		// Question Options
		$questions = $this->db->select('id')->get('question_banks');
		$fill_data = [];
		foreach ($questions->result() as $question) {
			$is_answer = rand(1, 5);
			for ($i=1; $i <=5 ; $i++) {
				$fill_data[] = [
					'question_id' => $question->id,
					'name' => str_replace('.', '', $faker->sentence($nbWords = 6, $variableNbWords = true)),
					'is_answer' => ($i == $is_answer ? 'true' : 'false')
				];
			}
		}
		$this->db->truncate('question_options');
		$this->db->insert_batch('question_options', $fill_data);

		// Subject Settings
		$majors = $this->db->select('id')->get('majors');
		$subjects = $this->db->select('id')->get('subjects');
		$fill_data = [];
		foreach ($majors->result() as $major) {
			foreach ($subjects->result() as $subject) {
				$fill_data[] = [
					'major_id' => $major->id,
					'subject_id' => $subject->id,
					'num_questions' => 5
				];
			}
		}
		$this->db->truncate('subject_settings');
		$this->db->insert_batch('subject_settings', $fill_data);

		// Scholar Ssettings
		$levels = $this->db->select('id')->get('levels');
		$scholars = $this->db->select('id')->get('scholars');
		$fill_data = [];
		foreach ($levels->result() as $level) {
			foreach ($scholars->result() as $scholar) {
				$fill_data[] = [
					'level_id' => $level->id,
					'scholar_id' => $scholar->id,
					'minimum_score' => rand(50, 100)
				];
			}
		}
		$this->db->truncate('scholar_settings');
		$this->db->insert_batch('scholar_settings', $fill_data);

		// Geneeral Settings
		$this->db->truncate('general_settings');
		$fill_data = [
			[
				'name' => 'ACTIVE_YEAR',
				'value' => '2016',
				'note' => 'Setting for current Year. Application Default is Current Year.'
			],
			[
				'name' => 'MAX_YEAR_DIFF',
				'value' => '1',
				'note' => 'Maximum year differences from user\'s graduation year allowed to take the exam. nApplication Default is 1.'
			]
		];
		$this->db->insert_batch('general_settings', $fill_data);
	}
}
