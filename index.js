const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';
const API_key="0ca512df00a9ae3d090fa3b20e6ccd42";

function renderWeatherInfo(data){
    let newPara = document.createElement('h2');
    newPara.textContent=`${data?.main?.temp.toFixed(2)}°C`;
    document.body.appendChild(newPara);
}

async function fetchWeatherInfo(){
    let lat = 29.685629;
    let lon = 76.990547;
    let city = "karnal";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const data = await response.json();

    console.log(city +"'s Weather: ", data);

    renderWeatherInfo(data);

}