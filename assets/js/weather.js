const cities = [];
const apiKey = `419207d61660bf83fba5c533508b28f7`;
const inputEl=document.querySelector("#city")
const submitEl=document.querySelector("#city-submit");
const weatherContainerEl=document.querySelector("#current-weather-container");
const fiveDayContainer = document.querySelector("#fiveday-container");
const pastSearchButtonEl = document.querySelector("#past-search-buttons");
const citySearchInputEl = document.querySelector("#searched-city");
const fiveDayTitle = document.querySelector("#five-day-title");

const formSumbitHandler = function(event){
  event.preventDefault();
  let city = inputEl.value.trim();
  if(city){
      getWeather(city);
      get5Day(city);
      cities.unshift({city});
      inputEl.value = "";
  } else{
      alert("Please enter a City");
  }
  saveSearch();
  pastSearch(city);
}

const saveSearch = function(){
  localStorage.setItem("cities", JSON.stringify(cities));
};

const getWeather = function(city){
  let api = `https:api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(api)
  .then(function(response){
      response.json()
  .then(function(data){
          displayWeather(data, city);
      });
  });
};

const displayWeather = function(weather, searchCity){
  let cityCase = searchCity.toUpperCase();

  weatherContainerEl.textContent= "";  
  citySearchInputEl.textContent= cityCase;

  let currentDate = document.createElement("span")
  currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  citySearchInputEl.appendChild(currentDate);


  let weatherPic = document.createElement("img")
  weatherPic.setAttribute("src", `https:openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
  citySearchInputEl.appendChild(weatherPic);

  let temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  temperatureEl.classList = "list-group-item"


  let humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  humidityEl.classList = "list-group-item"

  let windEl = document.createElement("span");
  windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windEl.classList = "list-group-item"


  weatherContainerEl.appendChild(temperatureEl);
  weatherContainerEl.appendChild(humidityEl);
  weatherContainerEl.appendChild(windEl);

  let lat = weather.coord.lat;
  let lon = weather.coord.lon;
  getUvIndex(lat,lon)
}

const getUvIndex = function(lat,lon){
  let apiURL = `https:api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

  fetch(apiURL)
  .then(function(response){
      response.json()
  .then(function(data){
          displayUvIndex(data)
      });
  });
}

const displayUvIndex = function(index){
  let uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: "
  uvIndexEl.classList = "list-group-item"

  let uvIndexValue = document.createElement("span")
  uvIndexValue.textContent = index.value

  if(index.value <=2){
      uvIndexValue.classList = "favorable"
  }else if(index.value >2 && index.value<=8){
      uvIndexValue.classList = "moderate "
  }
  else if(index.value >8){
      uvIndexValue.classList = "severe"
  };

  uvIndexEl.appendChild(uvIndexValue);
  weatherContainerEl.appendChild(uvIndexEl);
}

const get5Day = function(city){
  let api = `https:api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

  fetch(api)
  .then(function(response){
      response.json()
  .then(function(data){
         display5Day(data);
      });
  });
};


const display5Day = function(weather){
  fiveDayContainer.textContent = ""
  fiveDayTitle.textContent = "5 Day Forecast:";

  let forecast = weather.list;
      for(var i=5; i < forecast.length; i=i+8){
     let dailyForecast = forecast[i];
      
     
     let forecastEl=document.createElement("div");
     forecastEl.classList = "card bg-white text-dark m-2";

     let forecastDate = document.createElement("h5")
     forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
     forecastDate.classList = "card-header bg-primary text-white text-center"
     forecastEl.appendChild(forecastDate);

     let weatherPic = document.createElement("img")
     weatherPic.classList = "card-body text-center";
     weatherPic.setAttribute("src", `https:openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

     forecastEl.appendChild(weatherPic);
     
     let forecastTempEl=document.createElement("span");
     forecastTempEl.classList = "card-body bg-primary text-white text-center";
     forecastTempEl.textContent = dailyForecast.main.temp + " °F";

      forecastEl.appendChild(forecastTempEl);

     let forecastHumEl=document.createElement("span");
     forecastHumEl.classList = "card-body bg-primary text-white text-center";
     forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

      forecastEl.appendChild(forecastHumEl);

      fiveDayContainer.appendChild(forecastEl);
  }

}

const pastSearch = function(pastSearch){

  const pastSearchEl = document.createElement("button");
  let pastCityCase = pastSearch.toUpperCase();
  pastSearchEl.textContent = pastCityCase;
  pastSearchEl.classList = "btn btn-primary p-2 border";
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");
  pastSearchButtonEl.prepend(pastSearchEl);
  
}

const pastSearchHandler = function(event){
    let city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
        get5Day(city);
    }
}

submitEl.addEventListener("submit", formSumbitHandler);
pastSearchButtonEl.addEventListener("click", pastSearchHandler);