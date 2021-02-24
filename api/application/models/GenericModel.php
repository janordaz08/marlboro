<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
    class GenericModel extends CI_Model {  

        function hash_password($password){
           return password_hash($password, PASSWORD_BCRYPT);
        }
        function generic_update($tablename, $data, $where)
        {
            $query = $this->db->update($tablename, $data, $where);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return true;
        }
        function generic_insert($tablename, $data)
        {
            $query = $this->db->insert($tablename, $data);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return $this->db->insert_id();
        }
        function generic_delete($tablename, $where=false)
        {
            $query = $this->db->delete($tablename, $where);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return $query;
        }
        function generic_select($statement, $where=false)
        {
            $query = $this->db->query($statement, $where);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return $query->result();
        }
        function generic_select_a($statement, $where=false)
        {
            $array = array();
            $query = $this->db->query($statement, $where);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            $array = $this->convert_name($query->result_array());
            return $array;
        }
        function generic_select_one($statement, $where = false)
        {
            $array = array();
            $query = $this->db->query($statement, $where);
            if (! $query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            $array = $this->convert_name($query->result_array());
            if(sizeof($array) > 1) {
                throw new Exception("Returned multiple results");
            }
            return sizeof($array) == 0 ? null : $array[0];
        }
        function generic_empty($statement)
        {
            $query = $this->db->empty_table($statement);
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return $query;
        }
        function generic_select_like($columns, $tablename, $where)
        {
            
            $this->db->select($columns)->from($tablename)->limit(10000);
            foreach ($where as $i=>$w) {
                if ($w!='0' && $w!='') {
                    if (substr($i,-3)=='_id') $this->db->where($i,$w);
                    else $this->db->like($i,$w);
                }
            }
            $query = $this->db->get();
            if (!$query) {
                $this->log_db_error(__FUNCTION__);
                return false;
            }
            return $query->result_array();
        }

        function convert_name($array) {
            // foreach ($array as $key => $value) {
            //   $array[$key] = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
            // }
            return $array;
        }
  //       public function save_to_excel() {
  //           $header = json_decode($this->input->post('header'));
  //           $data = json_decode($this->input->post('data'));
  //           $title = $this->input->post('title');
            
  //           $this->load->library('Excel');
  //           $this->excel->setActiveSheetIndex(0);
  //           $this->excel->getActiveSheet()->setTitle('Sheet 1');      
            
  //           $row = 2;
  //           $col = 0;
            
  //           foreach($data as $line) {
  //               foreach($line as $elem) {
  //                   $this->excel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $elem);
  //                   $col++;
  //               }
  //               $col = 0;
  //               $row++;
  //           }
            
                    
  //           $row = 1;
  //           $col = 0;
  //           foreach($header as $head) {
  //               $this->excel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $head);
  //               $this->excel->getActiveSheet()->getStyleByColumnAndRow($col, $row)->applyFromArray(array("font" => array( "bold" => true)));
  //               $this->excel->getActiveSheet()->getColumnDimension(PHPExcel_Cell::stringFromColumnIndex($col))->setAutoSize(true);
  //               $col++;
  //           }
            
  //           $filename=$title.'.xls'; //save our workbook as this file name
  //           //header('Content-Type: application/vnd.ms-excel'); //mime type
  //           header('Content-Disposition: attachment;filename="'.$filename.'"'); //tell browser what's the file name
  //           header('Cache-Control: max-age=0'); //no cache
                        
  //           //save it to Excel5 format (excel 2003 .XLS file), change this to 'Excel2007' (and adjust the filename extension, also the header mime type)
  //           //if you want to save it as .XLSX Excel 2007 format
  //           $objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel5');  
  //           //force user to download the Excel file without writing it to server's HD
  //           $objWriter->save('php://output');
  //       }
		// function json_get_data($request, $sql) {
  //           /*$draw = $this->input->get_post('draw', true);
  //           $start = $this->input->get_post('start', true);
  //           $length = $this->input->get_post('length', true);
  //           $order_column = $this->input->get_post('order', true);
  //           $columns = $this->input->get_post('columns', true);
  //           $search = $this->input->get_post('search', true);*/
            
  //           $draw = $request['draw'];
  //           $start = $request['start'];
  //           $length = $request['length'];
  //           $order = $request['order'];
  //           $columns = $request['columns'];
  //           $search = $request['search'];
            
  //           // Paging
  //           if(isset($start) && $length != '-1') {
  //               //$this->db->limit($this->db->escape_str($length), $this->db->escape_str($start));
  //               $page = "LIMIT $start, $length";
  //           }
            
  //           // Ordering
  //           if(isset($order)) {  
  //               if($columns[$order[0]['column']]['orderable'] == 'true') {
  //                   //$this->db->order_by($order[0]['column']+1, $this->db->escape_str($order[0]['dir']));
  //                   $order = "ORDER BY ".($order[0]['column']+1)." ".$order[0]['dir'];
  //               }
  //           }
            
  //           // Filtering
  //           if(isset($search) && !empty($search['value'])) {
  //               $filter = "WHERE";    
  //               for($i = 0; $i < count($columns); $i++) {
  //                   if($columns[$i]['searchable']) {
  //                       //$this->db->or_like($columns[$i]['name'], $this->db->escape_like_str($search['value']));
  //                       if(!isset($where)) {
  //                           $filter = $filter." ".$columns[$i]['name']." LIKE '%".$search['value']."%'";
  //                           if($i+1 < count($columns)) {
  //                               $filter = $filter." OR";
  //                           }
  //                       } else {
  //                           $filter = $filter."OR ".$columns[$i]['name']." LIKE '%".$search['value']."%' ";
  //                       }
  //                   }
  //               }
  //           }
            
  //           //$this->db->select('SQL_CALC_FOUND_ROWS *', false);
  //           //$this->db->from($sql);
  //           $new_sql = "SELECT SQL_CALC_FOUND_ROWS a.* FROM (".$sql.") a ".$filter." ".$order." ".$page;
  //           $query = $this->db->query($new_sql);
  //           //$query = $this->db->get();        
  //           $result_temp = $query->result_array();
            
  //           foreach($result_temp as $i=>$temp) {
  //               $result[$i] = array_values($temp);
  //           }
            
  //           $this->db->select('FOUND_ROWS() as found_rows', FALSE);
  //           $recordsFiltered = $this->db->get()->row()->found_rows;
            
  //           /*$this->db->select('*');
  //           $this->db->from('style');
  //           $query = $this->db->get();*/
  //           $new_sql = "SELECT a.* FROM (".$sql.") a ";
  //           $query = $this->db->query($new_sql);
  //           $recordsTotal = $query->num_rows();
  //           //$recordsTotal = count($result);
            
  //           /*if(isset($search) && !empty($search['value'])) {
  //               $recordsFiltered = count($result);
  //           } else {
  //               $recordsFiltered = $recordsTotal;
  //           }*/
            
  //           $data = array(
  //               "draw" => $draw,
  //               "recordsTotal" => $recordsTotal,
  //               "recordsFiltered" => $recordsFiltered,
  //               "data" => $result
  //           );
  //           return json_encode($data);
  //       }
    }
?>