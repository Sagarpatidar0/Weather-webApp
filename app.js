const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

let temp = 30;
let icon;
let link, temp_f, dt, cloudy, humidity, pressure, wind, main;
let h_temp = [], h_pop = [], h_time = [],h_link=[];
app.get("/", function (req, res) {
  let url = "https://api.openweathermap.org/data/2.5/weather?q=bhopal&appid=ce3bfcd5c9db9c2e58557b2c6082c035&units=metric"
  https.get(url, function (responce) {
    // console.log(responce);
    responce.on("data", function (data) {
      const wdata = JSON.parse(data);
      temp = parseInt(wdata.main.temp) - 1;
      temp_f = parseInt(wdata.main.feels_like);
      icon = wdata.weather[0].icon;
      link = "/img/" + icon + "@2x.png"
      dt = givedate(Number(wdata.dt+"000"));
      main = wdata.weather[0].main;
      cloudy = wdata.clouds.all + "%";
      humidity = wdata.main.humidity + "%";
      wind = parseInt(((wdata.wind.speed) * 18) / 5) + "Km/h";
      pressure = wdata.main.pressure + "hPa";
      
    })
  });
  let url2 = "https://api.openweathermap.org/data/2.5/forecast?q=bhopal&appid=ce3bfcd5c9db9c2e58557b2c6082c035&units=metric"
  https.get(url2, function (responce) {

    var datas = [];

    responce.on("data", async function (data) {
      await datas.push(data);
    })
    responce.on("end", () => {
      let data   = Buffer.concat(datas);
      fdata =  JSON.parse(data);
      for (let i = 0; i < 6; i++) {
        let sec = parseInt((fdata.list[i].dt + "000"));
        let h_dt = new Date(sec);
        let h_hour = h_dt.getHours();
        if (h_hour > 12) {
          h_hour = (h_hour - 12) + "pm";
        } else {
          h_hour = h_hour + "am";
        }
        h_time[i] = h_hour
        let pop = ((fdata.list[i].pop) * 100);
        h_pop[i] = parseInt(pop) + "%";
        let t = parseInt(fdata.list[i].main.temp);
        h_temp[i] = t;
        let l = fdata.list[i].weather[0].icon
        h_link[i] =  "/img/"+ l + "@2x.png";
      }
      
      res.render('index', {
        temp: temp, temp_f: temp_f, link: link, city: "Bhopal", invalid: "", date: dt, main: main,
        pressure: pressure, wind: wind, cloudy: cloudy, humidity: humidity,
        temp1: h_temp[0], temp2: h_temp[1], temp3: h_temp[2], temp4: h_temp[3], temp5: h_temp[4], temp6: h_temp[5],
        pop1: h_pop[0], pop2: h_pop[1], pop3: h_pop[2], pop4: h_pop[3], pop5: h_pop[4], pop6: h_pop[5],
        time1: h_time[0], time2: h_time[1], time3: h_time[2], time4: h_time[3], time5: h_time[4], time6: h_time[5],
        link1: h_link[0], link2: h_link[1], link3: h_link[2], link4: h_link[3], link5: h_link[4], link6: h_link[5]
      });

    })
  })

})
let prev_city, city = "Bhopal", invalid_chack = 0, B_city;
app.post("/", function (req, res) {
  prev_city = city;
  city = (req.body.search);
  let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce3bfcd5c9db9c2e58557b2c6082c035&units=metric"
  https.get(url, function (responce) {

    if (responce.statusCode >= 400 && responce.statusCode <= 500) {

      if (invalid_chack == 1) {
        B_city = prev_city;
      } else if (invalid_chack == 0) {
        B_city = "Bhopal";
        invalid_chack--;
      }
      invalid_chack++;
      console.log(responce.statusCode);
      res.render('index', {
        temp: temp, temp_f: temp_f, link: link, city: B_city, invalid: "Invalid location", date: dt, main: main,
        pressure: pressure, wind: wind, cloudy: cloudy, humidity: humidity,
        temp1: h_temp[0], temp2: h_temp[1], temp3: h_temp[2], temp4: h_temp[3], temp5: h_temp[4], temp6: h_temp[5],
        pop1: h_pop[0], pop2: h_pop[1], pop3: h_pop[2], pop4: h_pop[3], pop5: h_pop[4], pop6: h_pop[5],
        time1: h_time[0], time2: h_time[1], time3: h_time[2], time4: h_time[3], time5: h_time[4], time6: h_time[5],
        link1: h_link[0], link2: h_link[1], link3: h_link[2], link4: h_link[3], link5: h_link[4], link6: h_link[5]
      });

    } else {
      responce.on("data", function (data) {
        invalid_chack = 1;
        const wdata = JSON.parse(data);
        temp = Math.floor(Number(wdata.main.temp));
        temp_f = Math.floor(wdata.main.feels_like);
        icon = wdata.weather[0].icon;
        link = "/img/" + icon + "@2x.png"
        main = wdata.weather[0].main;
        dt = givedate(Number(wdata.dt+"000"));
        cloudy = wdata.clouds.all + "%";
        humidity = wdata.main.humidity + "%";
        wind = parseInt(((wdata.wind.speed) * 18) / 5) + "Km/h";
        pressure = wdata.main.pressure + "hPa";


      })
      let url2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ce3bfcd5c9db9c2e58557b2c6082c035&units=metric"
      https.get(url2, function (responce) {

        var datas = [];
        responce.on("data", function (data) {
          datas.push(data);
        })
        responce.on("end", () => {
          const fdata = JSON.parse(datas);
          for (let i = 0; i < 6; i++) {
            let sec = parseInt((fdata.list[i].dt + "000"));
            let h_dt = new Date(sec);
            let h_hour = h_dt.getHours();
            if (h_hour > 12) {
              h_hour = (h_hour - 12) + "pm";
            } else {
              h_hour = h_hour + "am";
            }
            h_time[i] = h_hour
            let pop = ((fdata.list[i].pop) * 100);
            h_pop[i] = parseInt(pop) + "%";
            let t = parseInt(fdata.list[i].main.temp);
            h_temp[i] = t;
            let l = fdata.list[i].weather[0].icon
            h_link[i] =  "/img/"+ l + "@2x.png";
          }
          res.render('index', {
            temp: temp, temp_f: temp_f, link: link, city: city, invalid: "", date: dt, main: main,
            pressure: pressure, wind: wind, cloudy: cloudy, humidity: humidity,
            temp1: h_temp[0], temp2: h_temp[1], temp3: h_temp[2], temp4: h_temp[3], temp5: h_temp[4], temp6: h_temp[5],
            pop1: h_pop[0], pop2: h_pop[1], pop3: h_pop[2], pop4: h_pop[3], pop5: h_pop[4], pop6: h_pop[5],
            time1: h_time[0], time2: h_time[1], time3: h_time[2], time4: h_time[3], time5: h_time[4], time6: h_time[5],
            link1: h_link[0], link2: h_link[1], link3: h_link[2], link4: h_link[3], link5: h_link[4], link6: h_link[5]
          });

        })
      })
    }

  });

})
let ofset = 330*60*1000;
function givedate(sec) {
  let dt = new Date(sec+ofset);
  let h = dt.getHours();
  if (h > 12) {
    h = h - 12;
  }
  let m = dt.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  let d = dt.getDay();
  let day;
  switch (d) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
  }

  let mon = dt.getMonth();
  switch (mon) {
    case 0:
      month = "Jan";
      break;
    case 1:
      month = "Feb";
      break;
    case 2:
      month = "Mar";
      break;
    case 3:
      month = "Apr";
      break;
    case 4:
      month = "May";
      break;
    case 5:
      month = "Jun";
      break;
    case 6:
      month = "Jul";
      break;
    case 7:
      month = "Aug";
      break;
    case 8:
      month = "Sep";
      break;
    case 9:
      month = "Oct";
      break;
    case 10:
      month = "Nov";
      break;
    case 11:
      month = "Dec";
      break;
    default:
      month = "Invalid month";
  }
  let yea = dt.getFullYear();
  let year = yea % 100;
  let dat = dt.getDate();
  return `${h}:${m} ${day},${dat} ${month} ${year}`
}

app.listen(process.env.PORT||3000, () => {
  console.log("Port 3000");
})