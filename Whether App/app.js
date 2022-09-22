$(document).ready(() => {

    // writing clock code

    let day2 = ["sunday", "monday", "tuesday", "wednesday", "thersday", "friday", "saturday"];
    let month2 = ["jun", "jan", "fab", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "novem", "decem"];
    setInterval(() => {
        const date = new Date();
        const day = date.getDay();
        const hour = date.getHours();
        const month = date.getMonth();
        const minute = date.getMinutes();
        const date1 = date.getDate();
        const ampm = hour >= 13 ? "am" : "pm";
        const hour12 = hour >= 12 ? hour % 12 : hour;
        $("#clock").html(`
    <div><span class="display-1">${hour12 < 10 ? "0" + hour12 : hour12}:${minute < 10 ? "0" + minute : minute}</span><span class="fs-3"> ${ampm}</span></div>
    <div>${day2[day]}, ${date1} ${month2[month]}</div>
    </div>
    `)
    }, 1000);

    // getting current location for api forcast and current 

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            //5 day api forcast
            const apiForcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=72b3105a3e193076b9546a08f612a423&units=metric`;
            showForcast(apiForcast);
            //current api
            const apiCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=4daf5d4618e33ace8d716c73cbaa0f39&units=metric`;
            showCurrent(apiCurrent);


        })


    }
    else {
        alert("Browser did not get your address")
    }

    //calling api by city name
    $("#cityInput").keypress((e) => {
        if (e.key === "Enter") {
            cityEvent(e);
        }
    })

    $("#searchCity").click((e) => {
        cityEvent(e);
    });
    function cityEvent(event) {
        event.preventDefault();
        let city = $("#cityInput").val();
        showdata(city);
        $("#cityInput").val("");
    }


    function showdata(city) {
        if (!city == "") {

            apiForcast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=72b3105a3e193076b9546a08f612a423&units=metric`;
            showForcast(apiForcast);
            apiCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=72b3105a3e193076b9546a08f612a423&units=metric`;
            showCurrent(apiCurrent);
        }
        else {
            alert("Please entre the city name");
        }

    }

    // showing weather using forcast api 5 day

    function showForcast(api) {
        $.getJSON(api).done((data) => {
            console.log(data)
            //getting and putting data into display dailog box
            const { country, name } = data.city;
            $(".city").html(` <p>${country}&#92${name}</p>`)

            //getting and putting data into 5 day 3 hour forcast
            let weather = "";
            for (let index = 0; index < data.list.length; index += 7) {
                const element = data.list[index];
                // including data in display current box
                const { feels_like, temp } = element.main;
                const { dt } = element;
                const { icon, description } = element.weather[0];
                weather += `
                    <div class=" px-0 pb-3 col-lg-auto col-md-3 col-sm-4 col-8 border border-light glass rounded">
                    <div class="timeForcast text-light bg-dark">${moment(dt * 1000).format("hh a")}</div>
                    <div><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="#"></div>
                    <div class="text-capitalize">
                      <div class="bg-dark rounded-pill mx-2">${moment(dt * 1000).format("dddd")}</div>
                      <div>${description}</div>
                      <div class="mx-2">Temprature:- ${temp}&#8451</div>
                      <div class="mx-2">Feels_like:- ${feels_like}&#8451</div>
                    </div>
                  </div>
                    `;
                $(".add").html(weather);
            }
        })
    }


    //showing weather data by current location api
    function showCurrent(api) {
        $.getJSON(api).done((data) => {
            console.log(data)
            const { sunrise, sunset } = data.sys;
            const { temp, feels_like, humidity, temp_min, temp_max } = data.main;
            const { description, icon } = data.weather[0];
            const { speed } = data.wind;
            //data for right side dailog box
            $(".current").html(` 
        <div class="fs-5"><span>humidity:</span><span class="float-end">${humidity} %</span></div>
        <div class="fs-5"><span>wind:</span><span class="float-end">${speed} km&#92h</span></div>
            `);
            $(".sun").html(`
            <div class="fs-5"><span>sunset:</span><span class="float-end">${moment(sunset * 1000).format("hh:mm a")}</span></div>
            <div class="fs-5"><span>sunrise:</span><span class="float-end">${moment(sunrise * 1000).format("hh:mm a")}</span></div>
            `);

            weather = `
        <h2 class="mb-1 sfw-normal text-center">CURRENT</h2>
              <p class="mb-2">temperature: <strong>${temp}°C</strong></p>
              <p>Feels like: <strong>${feels_like}°c</strong></p>
              <p>Max: <strong>${temp_max}°C</strong>, Min: <strong>${temp_min}°C</strong></p>
              <div class="hstack justify-content-between" style="height: 13vh">
                <p class="mb-0 me-4 text-uppercase">${description}</p>
                <div><img width="150px" src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="#"></div>
              </div>`;
            $(".card-body").html(weather);

        })
    }
    //showing current weather by city name 

})