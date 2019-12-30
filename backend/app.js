const express = require('express');
const bodyparser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, COntent-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  var jsonToRes = {};
  const inputAddr = post.street + ' ,'+post.city+' ,'+post.state;
  const googleMapsClient = require('@google/maps').createClient({
    key: "AIzaSyBQ6cnaCTeWd3xSU52Or5Xn0ae1eQvasKI"
  });
  console.log("Inside the API");
  googleMapsClient.geocode({
    address: inputAddr
  }, function(err, response) {
    if(!err) {
      console.log('Inside success geocode');
      console.log(response);
      if(response.json.results.length <= 0) {
        console.log('Inside the error');
        res.status(200).json({
          message: 'Failed',
          status:200
        });
      } else {
      const latitude = response.json.results[0].geometry.location.lat;
      const longitude = response.json.results[0].geometry.location.lng;
      //const APIKey = "18087e7f222fa75c00b2d34c155ba638";
      //const urlForecast = 'https://api.darksky.net/forecast/18087e7f222fa75c00b2d34c155ba638/'+latitude+','+longitude;
      //axios.get(urlForecast).then((res) => {
        //console.log(res);
       // const jsonToRes = {};
       // const jsonRes = res.data;
       // const hourlyData = jsonRes.hourly.data;
       // const minutelyData = jsonRes.minutely.data;
       // const dailyData = jsonRes.daily.data;
       // jsonToRes['summary'] = jsonRes.currently.summary;
       // jsonToRes['humidity'] = jsonRes.currently.humidity;
        //jsonToRes['pressure'] = jsonRes.currently.pressure;
       // jsonToRes['windspeed'] = jsonRes.currently.windSpeed;
       // jsonToRes['visibility'] = jsonRes.currently.visibility;
       // jsonToRes['cloudcover'] = jsonRes.currently.cloudCover;
       // jsonToRes['ozone'] = jsonRes.currently.ozone;
       // jsonToRes['temperature'] = jsonRes.currently.temperature;
       // jsonToRes['minutelydata'] = minutelyData;
       // jsonToRes['hourlydata'] = hourlyData;
       // jsonToRes['dailydata'] = dailyData;
       // console.log(jsonToRes);
      //  returnData = jsonToRes;
    //}).catch(error => {
     // console.log(error);
    //});
      //  axios.get('https://www.googleapis.com/customsearch/v1?q=CA&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyDVZzd1HMzOLdwfRa62Ych_H4QwtOK8SMA&cx=000879462241872205933:fadjuwahwkv')
        //.then(response => {
          //jsonToRes['link'] = response.data.items[0].link;
       // })
       // .catch(error => {
        //  console.log(error);
       // });
       // console.log(returnData);
       // console.log("successfully called the api.");
       jsonToRes['lat'] = latitude;
       jsonToRes['long'] = longitude;
       jsonToRes['city'] = post.city;
       jsonToRes['state'] = post.state;
       console.log(jsonToRes);
       console.log('return');
       res.status(201).json({
        message: 'Post added successfully',
        dataRes: jsonToRes,
      });
    }
  }

  });

});

app.post("/api/forecastapi", (req, result, next) => {

  const latitude  = req.body.lat;
  const longitude = req.body.long;
  const jsonToRes = {};
  jsonToRes['lat'] = req.body.lat;
  jsonToRes['long'] = req.body.long;
  console.log('Inside the forecastAPI');

  const APIKey = "18087e7f222fa75c00b2d34c155ba638";
  const urlForecast = 'https://api.darksky.net/forecast/18087e7f222fa75c00b2d34c155ba638/'+latitude+','+longitude;
  console.log(urlForecast);
  axios.get(urlForecast).then((res) => {
    console.log(res.status);
    console.log('status');
    const jsonRes = res.data;
    const hourlyData = jsonRes.hourly.data;
    const minutelyData = jsonRes.minutely.data;
    const dailyData = jsonRes.daily.data;
    jsonToRes['city'] = req.body.city;
    jsonToRes['timezone'] = jsonRes.timezone;
    jsonToRes['summary'] = jsonRes.currently.summary;
    jsonToRes['humidity'] = jsonRes.currently.humidity;
    jsonToRes['pressure'] = jsonRes.currently.pressure;
    jsonToRes['windspeed'] = jsonRes.currently.windSpeed;
    jsonToRes['visibility'] = jsonRes.currently.visibility;
    jsonToRes['cloudcover'] = jsonRes.currently.cloudCover;
    jsonToRes['ozone'] = jsonRes.currently.ozone;
    jsonToRes['temperature'] = jsonRes.currently.temperature;
    jsonToRes['minutelydata'] = minutelyData;
    jsonToRes['hourlydata'] = hourlyData;
    jsonToRes['dailydata'] = dailyData;
    jsonToRes['state'] = req.body.state;

    const getstateSeal = 'https://www.googleapis.com/customsearch/v1?q='+ req.body.state +'&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyDVZzd1HMzOLdwfRa62Ych_H4QwtOK8SMA&cx=000879462241872205933:fadjuwahwkv';
    console.log(getstateSeal);
    axios.get(getstateSeal)
    .then((respo) => {
      jsonToRes['stateSeal'] = respo.data.items[0].link;
      console.log(respo.data.items[0].link);
      result.status(201).json({
        message: 'called success',
        returnFor: jsonToRes,
      });
    }).catch(error => {
      result.status(201).json({
        message: 'failure'
      });
    });
    }).catch(error => {
      result.status(201).json({
        message: 'failure'
      });    });


});


app.post("/api/dailyWeather", (req, result, next) => {

  console.log(req.body.lat + ", "+ req.body.long+", "+req.body.time);

  const url = 'https://api.darksky.net/forecast/18087e7f222fa75c00b2d34c155ba638/'+req.body.lat+', '+req.body.long+', '+req.body.time;

  axios.get(url)
    .then((respo) => {
      const jsonTosend = { };
      jsonTosend['time'] = respo.data.daily.data[0].time;
      jsonTosend['city'] = req.body.city;
      jsonTosend['temperature'] = respo.data.currently.temperature;
      jsonTosend['summary'] = respo.data.currently.summary;
      jsonTosend['icon'] = respo.data.currently.icon;
      jsonTosend['precipIntensity'] = Math.round(respo.data.currently.precipIntensity * 100)/100;
      jsonTosend['chanceOfRain'] = respo.data.currently.precipProbability * 100;
      jsonTosend['windSpeed'] = Math.round(respo.data.currently.windSpeed * 100)/100;
      jsonTosend['humidity'] = respo.data.currently.humidity * 100;
      jsonTosend['visibility'] = respo.data.currently.visibility;

      result.status(201).json({
        message: 'called success',
        returnData: jsonTosend,
      });
    }).catch(error => {
      console.log(error);
    });



});

app.post("/api/autocomplete", (req, result, next) => {

  console.log(req.body.query);

  const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+req.body.query+'&key=AIzaSyBPxov6R1JX3Va4dDk_GR17A3K21H0WFIE&types=(cities)'


  axios.get(url)
  .then((respo) => {
    const jsonTosend = { };
    console.log(respo.data.predictions);
    if(respo.data.predictions) {
    const dataArray = [];
    const predictionsRes = respo.data.predictions;
      predictionsRes.forEach(element => {
        const termsPred = element.terms;
        dataArray.push(termsPred[0].value);
      });

      jsonTosend['dataArr'] = dataArray;

      result.status(200).json({
        message: 'called success',
        dataArr: jsonTosend
      });
    } else {
      result.status(202).json({
        message: 'Failed'
      });
    }


  }).catch(error => {
    console.log(error);
  });


});


app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "ajdiasd",
      title: "First server-side post",
      content: "This is coming from the server"
    },
    {
      id: "asfnioaspdfm",
      title: "Second server-side post",
      content: "This is coming from second server"
    }
  ];
  res.status(200).json({
    message: 'posts fetched successfully',
    posts: posts
  });
});

app.get('/something', (req, res) => {
  console.log(req.query.color1);  // true
  console.log(req.query.color2); // true
})

module.exports = app;
