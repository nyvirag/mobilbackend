const express = require('express')
var cors = require('cors')
const mysql = require('mysql')
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static('images'))

var connection
function kapcsolat() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zaroedzes'
  })

  connection.connect()

}

//-----------------------------DEAFULT UZENET---------------------

app.get('/', (req, res) => {
  res.send('Hello World!')
})


//-----------------------------GYAKORLATOK---------------------
app.get('/gyakorlatok', (req, res) => {

  kapcsolat()
  connection.query('SELECT * FROM gyakorlatok', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});

//------------izomcsoportok keresése--------------------
app.get('/izomcsoportok', (req, res) => {

  kapcsolat()
  connection.query('SELECT * FROM izomcsoportok', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});





//segedtabla------------------------------

app.get('/felhasznalo_cel', (req, res) => {

  kapcsolat()
  connection.query('SELECT * FROM felhasznalo_cel', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});





//---------kozos screen a nemekhez----------------
app.get('/neme', (req, res) => {

  kapcsolat()
  connection.query('SELECT * FROM neme', (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});



/*INSERT INTO `gyakorlatok` VALUES (NULL, 'alma', 'állkapocs', 'ráharapsz kitörik a fogad', 'alma.jpg');



app.post('/felvitelgyak', (req, res) => {
  kapcsolat()

  connection.query(`INSERT INTO gyakorlatok VALUES (NULL, 'alma', 'állkapocs', 'ráharapsz kitörik a fogad', 'alma.jpg')`, (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      res.send("Hiba")
    }
    else {
      console.log("Sikeres felvitel")
      res.send("Sikeres felvitel")
    }




  })
  connection.end()
})
*/






const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './images');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });



app.post('/api/upload', upload.array('photo', 3), (req, res) => {
  console.log('file', req.files);
  console.log('body', req.body);

/*----------adatbbe valo feltoltes----------------*/
  kapcsolat()
  connection.query(`INSERT INTO gyakorlatok VALUES (NULL, '${req.body.bevitel1}', 'állkapocs', 'ráharapsz kitörik a fogad', '${req.files[0].filename}')`, (err, rows, fields) => {
    if (err) {
      console.log("Hiba")
      res.send("Hiba")
    }
    else {
      console.log("Sikeres felvitel")
      res.send("Sikeres felvitel")
    }




  })
  connection.end()




  
});


//-----------------noi kategoria-----------------------

app.post('/kaja_kategoriak_noi', (req, res) => {

  kapcsolat()
  connection.query(`SELECT * FROM kaja_noi 
  INNER JOIN suly_mertek ON kaja_noi.suly_mertek=suly_mertek.mertek_id 
  INNER JOIN suly_fajta on kaja_noi.suly_fajta = suly_fajta.suly_id
  WHERE kaja_kategoria =${req.body.bevitel1}`, (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});


//-----------ferfi kategoria----------------
app.post('/kaja_kategoriak_ferfi', (req, res) => {

  kapcsolat()
  connection.query(`SELECT * FROM kaja_ferfi
                    INNER JOIN suly_mertek ON kaja_ferfi.suly_mertek = suly_mertek.mertek_id
                    INNER JOIN suly_fajta ON kaja_ferfi.suly_fajta = suly_fajta.suly_id
                   WHERE kaja_kategoria=${req.body.bevitel1}`, (err, rows, fields) => {
    if (err) throw err

    console.log(rows)
    res.send(rows)
  })
  connection.end()
});

//-----------------------------------------keresés-------------------------------------

app.post('/keresszoveg', (req, res) => {
kapcsolat()

connection.query(`SELECT * FROM gyakorlatok INNER JOIN izomcsoportok ON gyakorlatok.izomcsoport=izomcsoportok.izomcsoport_id WHERE izomcsoportok.izomcsoport_id = ${req.body.bevitel1}`, (err, rows, fields) => {
if (err) throw err

console.log(rows)
res.send(rows)
})
connection.end() 
})

//-----------mapesbiszbaszhoz--------------
app.get('/izomcsoport', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM izomcsoportok`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })

//----------------------



app.post('/keresferfikaja', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM kaja_ferfi 
					INNER JOIN kaja_kategoria ON kaja_ferfi.kaja_kategoria=kaja_kategoria.kategoria_id 
					INNER JOIN suly_mertek ON kaja_ferfi.suly_mertek=suly_mertek.mertek_id 
					WHERE suly_fajta = ${req.body.bevitel1}`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })




//--------------------------------------------------------------------
app.get('/sulyok', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM suly_fajta`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })

//------------------------------------------------
app.post('/keresnoikaja', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM kaja_noi 
					INNER JOIN kaja_kategoria ON kaja_noi.kaja_kategoria=kaja_kategoria.kategoria_id 
					INNER JOIN suly_mertek ON kaja_noi.suly_mertek=suly_mertek.mertek_id 
					WHERE suly_fajta = ${req.body.bevitel1}`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
      console.log(req.body.bevitel1)
  })
  connection.end() 
  })



//-------------------szavazos-----------------
app.post('/uzenetfelvitel', (req, res) => {
kapcsolat()

    connection.query(`INSERT INTO csevego VALUES (NULL, "${req.body.bevitel1}","${req.body.bevitel2}" )`, (err, rows, fields) => {
        if (err) {
            res.send("HIBA")
            console.log("HIBA")
        }
        else {
            console.log(rows)
            res.send(rows)
        }



    })

    connection.end()

})



//-------------gyakorlatkedveles----------------
app.post('/kedveles_gyakorlat', (req, res) => {
  kapcsolat()
  
  connection.query(`INSERT INTO kedvencek VALUES (NULL, 1, '${req.body.bevitel1}')`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })


//-------------kedvencek----------------
app.get('/kedvencek', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM gyakorlatok INNER JOIN kedvencek ON gyakorlatok.gyakorlat_id=kedvencek.kedvenc_gyakorlat_id WHERE kedvenc_felhasznalo_id=1`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })



//-------csevegolekerdezes--------------
 app.get('/csevegole', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM csevego`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })


//--------------------blog magyar---------------------

 app.get('/blog', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM blog WHERE nyelv=0`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })

//--------------------blog angol---------------------

 app.get('/blogAngol', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM blog WHERE nyelv=1`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })



  //---------kategorias picker --------------
  
app.get('/Krisz_kategoria', (req, res) => {
  kapcsolat()
  
  connection.query(`SELECT * FROM kaja_kategoria`, (err, rows, fields) => {
  if (err) throw err
  
  console.log(rows)
  res.send(rows)
  })
  connection.end() 
  })

//törlés------------------------------

app.delete('/torles', (req, res) => {
  kapcsolat()
  connection.query(`DELETE FROM kedvencek WHERE kedvenc_id=${req.body.bevitel1}`, function (err, rows, fields) {
    if (err) {
      console.log("Hiba!")
      res.send("Hiba!")
    }
    else {
    console.log("A törlés sikeres")
    res.send("A törlés sikeres")
  }
  })
  connection.end()
})





app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});

