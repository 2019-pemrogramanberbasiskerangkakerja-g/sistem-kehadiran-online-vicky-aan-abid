var express = require('express');
var router = express.Router();
var matkul = [
   {idmatkul: 101, name: "PBKK G", pertemuanke: 1},
   {idmatkul: 104, name: "PBKK H", pertemuanke: 1}
];

//Routes will go here
module.exports = router;

router.get('/', function(req, res){
    res.json(matkul);
 });

router.get('/:idmatkul', function(req, res){
   var rekapmatkul = matkul.filter(function(rekapmatkul){
      if(rekapmatkul.idmatkul == req.params.idmatkul){
         return true;
      }
   });
   if(rekapmatkul.length == 1){
      res.json(rekapmatkul[0])
   } else {
      res.status(404);//Set status to 404 as movie was not found
      res.json({message: "Not Found"});
   }
});

var pertemuan = [
   {idmatkul: 101, pertemuanke: 1},
   {idmatkul: 104, pertemuanke: 1}
];

router.get('/:idmatkul/:pertemuanke', function(req, res){
   var rekappertemuan = pertemuan.filter(function(rekappertemuan){
   if(rekappertemuan.idmatkul == req.params.idmatkul){
       if(rekappertemuan.pertemuanke == req.params.pertemuanke){
           return true;
       }
   }
   });
   if(rekappertemuan.length == 1){
   res.json(rekappertemuan[0])
   } else {
   res.status(404);//Set status to 404 as movie was not found
   res.json({message: "Not Found"});
   }
});