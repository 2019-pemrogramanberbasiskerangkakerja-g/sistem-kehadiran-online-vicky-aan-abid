 <?php  
 $message = '';  
 $error = '';  
 if(isset($_POST["submit"]))  
 {  
      if(empty($_POST["idmatkul"]))  
      {  
           $error = "<label class='text-danger'>Masukkan Kode Matakuliah</label>";  
      }  
      else if(empty($_POST["namamatkul"]))  
      {  
           $error = "<label class='text-danger'>Masukkan Nama Matakuliah</label>";  
      }  
      else if(empty($_POST["kelas"]))  
      {  
           $error = "<label class='text-danger'>Masukkan Kelas</label>";  
      }  
      else  
      {  
           if(file_exists('data_matkul.json'))  
           {  
                $current_data = file_get_contents('data_matkul.json');  
                $array_data = json_decode($current_data, true);  
                $extra = array(  
                     'idmatkul'               =>     $_POST['idmatkul'],  
                     'namamatkul'          =>     $_POST["namamatkul"],  
                     'kelas'     =>     $_POST["kelas"]  
                );  
                $array_data[] = $extra;  
                $final_data = json_encode($array_data);  
                if(file_put_contents('data_matkul.json', $final_data))  
                {  
                     $message = "<label class='text-success'>Data Berhasil Ditambahkan!</p>";  
                }  
           }  
           else  
           {  
                $error = 'JSON File not exits';  
           }  
      }  
 }  
 ?>  
 <!DOCTYPE html>  
 <html>  
      <head>  
           <title>Tambah Data Mahasiswa</title>  
           <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>  
           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />  
           <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>  
      </head>  
      <body>  
           <br />  
           <div class="container" style="width:500px;">  
                <h3 align="">Tambah Data Mahasiswa</h3><br />                 
                <form method="post">  
                     <?php   
                     if(isset($error))  
                     {  
                          echo $error;  
                     }  
                     ?>  
                     <br />  
                     <label>Kode Matakuliah</label>  
                     <input type="text" name="idmatkul" class="form-control" /><br />  
                     <label>Nama Matakuliah</label>  
                     <input type="text" name="namamatkul" class="form-control" /><br />  
                     <label>Kelas</label>  
                     <input type="kelas" name="kelas" class="form-control" /><br />  
                     <input type="submit" name="submit" value="Submit" class="btn btn-info" /><br />                      
                     <?php  
                     if(isset($message))  
                     {  
                          echo $message;  
                     }  
                     ?>  
                </form>  
           </div>  
           <br />  
      </body>  
 </html> 