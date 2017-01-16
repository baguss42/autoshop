<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Autoshop
 * @version    0.1
 * @author     Hyperl Technology| http://hyperl.in
 * @copyright  (c) 2016
 * @link       http://hyperl.in
 */

class Login extends CI_Controller {

	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
		if ($this->auth->is_logged_in()) {
			if ($this->session->userdata('user_type') == 'user') {
				redirect(base_url());
			}
			redirect('dashboard');
		}
		$this->load->model('m_users');
		$this->pk = M_users::$pk;
		$this->table = M_users::$table;
	}
	
	/**
	 * Index
	 */
	public function index() {
		$this->load->library('form_validation');
		$val = $this->form_validation;
		$val->set_rules('email_l', 'Email', 'trim|required|valid_email');
		$val->set_rules('password_l', 'Password', 'trim|required');
		if ($val->run() == FALSE) {
			$this->load->helper(['captcha', 'string', 'form']);
			$this->data['title'] = 'LOGIN';
			$this->data['login'] = true;
			$this->data['content'] = 'front-end/user/register';
			$this->load->view('front-end/index', $this->data);
		} else {
			$email = $this->input->post('email_l', true);
			$password = $this->input->post('password_l', true);
			if ($this->auth->logged_in($email, $password)) {
				if ($this->session->userdata('user_type') == 'user') {
					redirect('');
				}
				redirect('dashboard');
			}
			redirect('register');
		}
	}
}