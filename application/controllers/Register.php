<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Autoshop
 * @version    0.1
 * @author     Hyperl Technology| http://hyperl.in
 * @copyright  (c) 2016
 * @link       http://hyperl.in
 */

class Register extends CI_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
		$this->load->model('m_users');
		$this->table = M_users::$table;
		$this->load->helper('form');
	}
	
	/**
	 * Index
	 */
	public function index() {
		$this->load->library('form_validation');
		$val = $this->form_validation;
		$val->set_rules('full_name', 'Full Name', 'trim|required');
		$val->set_rules('email', 'Email', 'trim|required|valid_email');
		$val->set_rules('password', 'Password', 'trim|required');
		if($val->run() == FALSE) {
			$this->data['title'] = 'Register';
			$this->data['content'] = 'front-end/user/register';
			$this->load->view('front-end/index', $this->data);
		}
		else {
			$fill_data = $this->get_data();
			$query = $this->model->insert($this->table, $fill_data);
			if($query) {
				$session_data = [];
				$session_data['alert_title'] = 'INFORMATION';
				$session_data['alert_message'] = 'Your data has been saved. Cek your email for activation account !';
				$this->session->set_userdata($session_data);
				redirect(current_url());
			}
		}
	}

	private function get_data() {
		return [
			'full_name' => $this->input->post('full_name',true),
			'email' => $this->input->post('email',true),
			'password' => password_hash($this->input->post('password'), PASSWORD_BCRYPT)
		];
	}

}