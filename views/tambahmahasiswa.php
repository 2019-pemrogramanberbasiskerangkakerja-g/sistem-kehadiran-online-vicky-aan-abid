 <?php  
 $message = '';  
 $error = '';  
 if(isset($_POST["submit"]))  
 {  
      if(empty($_POST["NRP"]))  
      {  
           $error = "<label class='text-danger'>Masukkan NRP</label>";  
      }  
      else if(empty($_POST["nama"]))  
      {  
           $error = "<label class='text-danger'>Masukkan Nama</label>";  
      }  
      else if(empty($_POST["password"]))  
      {  
           $error = "<label class='text-danger'>Masukkan password</label>";  
      }  
      else  
      {  
           if(file_exists('data_mahasiswa.json'))  
           {  
                $current_data = file_get_contents('data_mahasiswa.json');  
                $array_data = json_decode($current_data, true);  
                $extra = array(  
                     'NRP'               =>     $_POST['NRP'],  
                     'nama'          =>     $_POST["nama"],  
                     'password'     =>     $_POST["password"]  
                );  
                $array_data[] = $extra;  
                $final_data = json_encode($array_data);  
                if(file_put_contents('data_mahasiswa.json', $final_data))  
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
                     <label>NRP</label>  
                     <input type="text" name="NRP" class="form-control" /><br />  
                     <label>Nama</label>  
                     <input type="text" name="nama" class="form-control" /><br />  
                     <label>Password</label>  
                     <input type="password" name="password" class="form-control" /><br />  
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