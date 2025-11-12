const ApiKey = "e13eba9b6e5d44b6be381937250311"

var searchInput = document.querySelector("input");
var searchBtn = document.querySelector("button");

// return search value//

function getResults() {
  return searchInput.value;
}
// trigger search when button clicked //
searchBtn.addEventListener("click", function () {
  var result = getResults();
  getForecast(result);
});

// get weather data from API //
async function getForecast(result) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${result}&days=7`);
    var data = await response.json();
    // call display function with forecast and city name//
    display(data.forecast.forecastday, data.location.name);
  } catch (error) {
    console.log("⚠️ Something went wrong");
  }
}

// show User Location on load //
async function getCurrentLocation(lat , lon) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${ApiKey}&q=${lat},${lon}&days=7`);
    var data = await response.json();
    display(data.forecast.forecastday, data.location.name);
  } catch (error) {
    console.log("⚠️ Something went wrong");
  }
}
// get User current Location  //
function getUserLocation (){
if (navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    (position) =>{
      let lat = position.coords.latitude
      let lon = position.coords.longitude
      getCurrentLocation(lat ,lon)
    },
    (error) =>{
      console.log(error);
      console.log("⚠️ Location access denied or error:");
      getForecast("cairo")
    }
  )
}
}
getUserLocation()

function display(array, cityName) {
  // Day Name //
  function getDayName(dateN) {
    var date = new Date(dateN);
    return date.toLocaleDateString("en-US" ,{weekday : "long"})
  }
 // Date //
  function getDayDate(dateD) {
    var date = new Date(dateD);
    return date.toLocaleDateString("en-US" ,{ day: "numeric", month: "short" })
  }
  var content = "";
  for (var i = 0; i < 3; i++) {
    var dayName = getDayName(array[i].date);
    var dayDate = getDayDate(array[i].date);
    content += ` 
         <div class="col-md-4 d-flex flex-column gap-3 position-relative border border-white border-bottom-0 border-top-0 border-start-0">
                    <div class="inner d-flex justify-content-between align-items-center rounded-pill px-4 mb-4">
                        <h3 class="fw-bold">${dayName}</h3>
                        <h4 class="fw-bold">${dayDate} </h4>
                    </div>
                    <span> 
                        <i class="fa-solid fa-location-dot"></i>
                      ${cityName}
                    </span>
                    <h1 class="fw-bold display-3">${array[i].day.maxtemp_c}°C</h1>
                     <h4 class="fw-bold">${array[i].day.mintemp_c}°C</h4>
                    <span>${array[i].day.condition.text}
                    <img src="https:${array[i].day.condition.icon}" alt="weather icon"/>
                    </span>
                  <div class="icon-wrapper d-flex align-items-center justify-content-center gap-1">
                    <i class="fa-solid fa-umbrella fs-3"></i><span>${array[i].day.daily_chance_of_rain}</span>
                    <i class="fa-solid fa-wind fs-3"></i><span>${array[i].day.maxwind_mph}</span>
                  </div>
                </div>
               
                `;
  }
  // inject cards into page //
  document.querySelector(".rowData").innerHTML = content; 
}
