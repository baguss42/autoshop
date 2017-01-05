<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Try Out
 * @version    0.1
 * @author     Software Development President University | https://president.ac.id
 * @copyright  (c) 2016
 * @link       https://president.ac.id
 */

class Register extends CI_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
		// $this->load->model('m_students');
		// $this->pk = M_students::$pk;
		// $this->table = M_students::$table;
	}
	
	/**
	 * Index
	 */
	public function index() {
		$this->data['title'] = 'Register';
		$this->data['content'] = 'front-end/user/register';
		$this->load->view('front-end/index', $this->data);
	}

}