<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Try Out
 * @version    0.1
 * @author     Software Development President University | https://president.ac.id
 * @copyright  (c) 2016
 * @link       https://president.ac.id
 */

class Auth {

    /**
     * The CodeIgniter super object
     *
     * @var object
     * @access public
     */
    public $CI;

    /**
     * Class constructor
     */
    public function __construct() {
        $this->CI = &get_instance();
        $this->CI->load->model('m_users');
    }

    /**
     * logged_in()
     * @access  public
     * @param   string
     * @param   string
     * @return  bool
     */
    public function logged_in($email, $password) {
        $query = $this->CI->m_users->logged_in($email);
        if ($query->num_rows() === 1) {
            $data = $query->row();
            if (password_verify($password, $data->password)) {
                $session_data = [];
                $session_data['id'] = $data->id;
                $session_data['user_type'] = $data->user_type;
                $session_data['full_name'] = $data->full_name;
                $session_data['birth_date'] = $data->birth_date;
                $session_data['email'] = $data->email;
                $session_data['address'] = $data->address;
                $session_data['is_logged_in'] = TRUE;
                $this->CI->session->set_userdata($session_data);
                $this->last_logged_in($data->id);
                return TRUE;
            }
            return FALSE;
        }
        return FALSE;
    }

    /**
     * get_user_id
     * @access  public
     * @return integer
     **/
    public function get_user_id() {
        $id = $this->session->userdata('id');
        return !empty($id) ? $id : NULL;
    }

    /**
     * last_logged_in
     * Fungsi untuk mengupdate data login terakhir
     * @access   public
     * @return   void
     */
    private function last_logged_in($id) {
        $this->CI->m_users->last_logged_in($id);
    }

    /**
     * is_logged_in
     * Fungsi untuk mengecek apakah data session user id kosong / tidak
     * @access   public
     * @return   bool
     */
    public function is_logged_in() {
        return $this->CI->session->userdata('is_logged_in');
    }

    /**
     * restrict
     * Fungsi untuk memvalidasi status login
     * @access   public
     * @return   bool
     */
    public function restrict() {
        if (!$this->is_logged_in()) {
            redirect('login');
        }
    }
}