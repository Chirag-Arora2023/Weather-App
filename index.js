//https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png
//http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png

const API_KEY="0ca512df00a9ae3d090fa3b20e6ccd42";
const userTab = document.querySelector("[data-user-tab]");
const searchTab = document.querySelector("[data-search-tab]");

const grantAccess = document.querySelector(".grant-access-container");
const weatherInfo = document.querySelector(".user-info-container");
const formContainer = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-screen-container");

const grantAccessBtn = document.querySelector("[data-grant-access-btn]");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector("[data-searchInput]");
const notFound = document.querySelector(".not-found");


let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!formContainer.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            weatherInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            formContainer.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            formContainer.classList.remove("active");
            weatherInfo.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getFromSessionStorage();
        }
    }
    // if(!searchTab.classList.contains("current-tab")){
    //     currentTab.classList.remove("current-tab");
    //     currentTab=clickedTab;
    //     currentTab.classList.add("current-tab");

    //     grantAccess.classList.remove("active");
    //     weatherInfo.classList.remove("active");
    //     formContainer.classList.add("active");
    // }
    // else{
    //     weatherInfo.classList.remove("active");
    //     formContainer.classList.remove("active");
    //     console.log("switched tab successfully");
    //     getFromSessionStorage();
    // }
    
        

    
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    console.log("entered getfromsessionstorage");
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccess.classList.add("active");
        console.log("local coordinates not found.");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        console.log("local coordinates  found.");
        fetchUserWeatherInfo(coordinates);
    }
}

function renderWeatherInfo(weatherInfo){
    console.log(" entered render function ");

    const cityName = document.querySelector("[data-cityName]");
    const countryFlag = document.querySelector("[data-flag]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const DescIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.textContent = weatherInfo?.name;
    countryFlag.src = `https:flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = weatherInfo?.weather?.[0]?.description;
    DescIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.textContent = weatherInfo?.main?.temp+"°C";
    windSpeed.textContent = weatherInfo?.wind?.speed + "m/s";
    humidity.textContent = weatherInfo?.main?.humidity + "%";
    clouds.textContent = weatherInfo?.clouds?.all+"%";

    

}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    console.log("coordinates = " +coordinates);
    console.log("lat,lon: "+{lat,lon});
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        console.log("API call done.")

        let data = await response.json();
        console.log("json conversion done.");

        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert("Weather could not be fetched.");
    }
}



function showLocation(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let location = {lat,lon};

    sessionStorage.setItem("user-coordinates",JSON.stringify(location));
    fetchUserWeatherInfo(location);
}

function getLocation(){
    loadingScreen.classList.add("active");
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showLocation);
    }
    else{
        alert("Permission denied");
    }
}

grantAccessBtn.addEventListener('click',getLocation);




async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        let data = await response.json();
        console.log(data);
        if(data?.cod==404)throw new error(404);
        loadingScreen.classList.remove("active");
        renderWeatherInfo(data);
    
        weatherInfo.classList.add("active");
    }
    catch(error){

        loadingScreen.classList.remove("active");
        weatherInfo.classList.remove("active");
        notFound.classList.add("active");
    }
}

formContainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    let city= searchInput.value;
    if(city === "")return;
    else{
        console.log("input city = "+searchInput.value);
        fetchSearchWeatherInfo(city);
    }
})





