<?php defined('BASEPATH') OR exit('No direct script access allowed');
Class M_users extends CI_Model {
	/**
	 * Primary key
	 * @var string
	 */
	public static $pk = 'id';

	/**
	 * Table
	 * @var string
	 */
	public static $table = 'users';
	
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Get data for pagination
	 * @param string
	 * @param int
	 * @param int
	 * @return Query
	 */
	public function get_where($keyword, $per_page, $position) {
		return $this->db
			->select('id, full_name, email, birth_date, address, is_deleted')
			->where('user_type', 'administrator')
			->group_start()
			->like('full_name', $keyword)
			->or_like('email', $keyword)
			->or_like('birth_place', $keyword)
			->or_like('birth_date', $keyword)
			->or_like('address', $keyword)
			->group_end()			
			->order_by('full_name', 'ASC')
			->get(self::$table, $per_page, $position);
	}
	
	/**
	 * Get Total row for pagination
	 * @param string
	 * @return int
	 */
	public function total_rows($keyword) {
		return $this->db
			->where('user_type', 'administrator')
			->group_start()
			->like('full_name', $keyword)
			->or_like('email', $keyword)
			->or_like('birth_place', $keyword)
			->or_like('birth_date', $keyword)
			->or_like('address', $keyword)
			->group_end()
			->count_all_results(self::$table);
	}

	/**
     * logged_in()
     * @access  public
     * @param   string
     * @return  bool
     */
	public function logged_in($email) {
		return $this->db
			->select('id
				, full_name
				, password
				, birth_date
				, email
				, address
				, phone
				, user_type
			')
         ->where('email', $email)
         ->where('is_active', 'true')
         ->where('is_deleted', 'false')
         ->get(self::$table);
	}

	/**
     * last_logged_in()
     * @access  public
     * @param   int
     * @return  void
     */
	public function last_logged_in($id) {
		$fields = [
			'last_logged_in' => date('Y-m-d H:i:s'),
			'ip_address' => $_SERVER['REMOTE_ADDR']
		];
		$this->db
			->where(self::$pk, $id)
			->update(self::$table, $fields);
	}

	/**
     * get last logged in
     * @access  public
     * @return  query
     */
	public function get_last_logged_in() {
		return $this->db
			->select('user_name, last_logged_in')
			->limit(10)
			->order_by('last_logged_in', 'DESC')
			->get(self::$table);
	}

	/**
	 * @param string
	 * @return Boolean
	 */
	public function user_activated($activation_key) {
		$this->db->trans_start();
		$this->db
			->where('activation_key', $activation_key)
			->where('is_active', 'false')
			->update(self::$table, ['is_active' => 'true']);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}
}
