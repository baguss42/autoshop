<?php 
Class M_helper extends CI_Model {
	/**
	 * Constructor
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * @param string
	 * @param array
	 * @return Boolean
	 */
	public function insert($table, array $fill_data) {
		$this->db->trans_start();
		$this->db->insert($table, $fill_data);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	 * @param string
	 * @param string
	 * @param string
	 * @param array
	 * @return Boolean
	 */
	public function update($id, $table, array $fill_data) {
		$this->db->trans_start();
		$this->db->where(self::$pk, $id)->update($table, $fill_data);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	 * @param string
	 * @param string
	 * @param string
	 * @return Boolean
	 */
	public function delete_permanently($key, $value, $table) {
		$this->db->trans_start();
		$this->db->where_in($key, $value)->delete($table);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	 * @param string
	 * @param string
	 * @param string
	 * @return Boolean
	 */
	public function delete(array $ids, $table) {
		$this->db->trans_start();
		$this->db->where_in(self::$pk, $ids)
			->update($table, [
				'is_deleted' => 'true',
				'deleted_by' => 1, // $this->session->users_id
				'deleted_at' => date('Y-m-d H:i:s')
			]
		);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	 * @param string
	 * @return Boolean
	 */
	public function truncate($table) {
		$this->db->trans_start();
		$this->db->truncate($table);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	 * @param string
	 * @param string
	 * @param string
	 * @return Boolean
	 */
	public function restore(array $ids, $table) {
		$this->db->trans_start();
		$this->db->where_in(self::$pk, $ids)
			->update($table, [
				'is_deleted' => 'false',
				'restored_by' => 1, // $this->session->users_id
				'restored_at' => date('Y-m-d H:i:s')
			]
		);
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	* is_exist
	 * @param string
	 * @param string
	 * @param string
	 * @return Boolean
	 */
	public function is_exist($key, $value, $table) {
		$count = $this->db
			->where($key, $value)
			->count_all_results($table);
		return $count > 0;
	}

	/**
	 * Row Object
	 * @return Object
	 */
	public function RowObject($table, $key, $value) {
		return $this->db
					->where($key, $value)
					->get($table)
					->row();
	}

	/**
	 * Results Object
	 * @return Array of Object
	 */
	public function ResultsObject($table) {
		return $this->db->get($table)->result();
	}

	/**
	 * Row Array
	 * @return Array
	 */
	public function RowArray($table, $key, $value) {
		return $this->db
					->where($key, $value)
					->get($table)
					->row_array();
	}

	/**
	 * Results Array
	 * @return Array of Array
	 */
	public function ResultsArray($table) {
		return $this->db->get($table)->result_array();
	}
}
?>