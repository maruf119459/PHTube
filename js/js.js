async function loadVideo(categoryName="1000",istrue,isSort=false){
    
    if(istrue){
        console.log(categoryName);
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryName}`);
        const responseObject = await response.json();
        const responseData = responseObject.data;
        console.log(responseData);
        displayVideo(responseData);
    }
    else{
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/1000`);
        const responseObject = await response.json();
        const responseData = responseObject.data;
        console.log(responseData);
        displayVideo(responseData,isSort);
    }
}


function convertSecondsToTime(seconds) {
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400; // 24 hours in a day
    const secondsInMonth = 2592000; // 30 days in a month (approximate)
    const secondsInYear = 31536000; // 365 days in a year (approximate)

    const years = Math.floor(seconds / secondsInYear);
    const remainingSecondsAfterYears = seconds % secondsInYear;

    const months = Math.floor(remainingSecondsAfterYears / secondsInMonth);
    const remainingSecondsAfterMonths = remainingSecondsAfterYears % secondsInMonth;

    const days = Math.floor(remainingSecondsAfterMonths / secondsInDay);
    const remainingSecondsAfterDays = remainingSecondsAfterMonths % secondsInDay;

    const hours = Math.floor(remainingSecondsAfterDays / secondsInHour);
    const remainingSecondsAfterHours = remainingSecondsAfterDays % secondsInHour;

    const minutes = Math.floor(remainingSecondsAfterHours / secondsInMinute);
    const remainingSeconds = remainingSecondsAfterHours % secondsInMinute;

    const timeObject = {
        years: years,
        months: months,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: remainingSeconds,
    };

    return timeObject;
}

const sortVideosByViews = (videos) => {
    // Use the sort method to sort the array based on "views"
    videos.sort((a, b) => {
        const viewsA = parseFloat(a.others.views.replace('K', '')) * 1000; // Convert 'K' to actual value
        const viewsB = parseFloat(b.others.views.replace('K', '')) * 1000;

        // Compare views in descending order
        return viewsB - viewsA;
    });

    return videos;
};

function sortByView(){
    if(navigator.onLine){
        contronLoading(true);
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.add('hidden');
    }
    oflineLoading();
    const video = document.getElementById('video');
    video.innerText ='';
    const noData = document.getElementById('no-data-view');
    noData.innerText ='';
    loadVideo('1000',false,true);
}

function displayVideo(responseData,isSort=false){
    
    

    if(isSort){
        responseData = sortVideosByViews(responseData);
    }
    console.log(responseData);

    if(responseData.length === 0){
        contronLoading(false);
        const noData = document.getElementById('no-data-view');
        noData.classList.remove('hidden');
    }
    else{
        const noData = document.getElementById('no-data-view');
        noData.classList.add('hidden');
    }

    const video = document.getElementById('video');
    video.innerText ='';

    for(const item of responseData){
        const views = parseInt(item.others.posted_date);
        let time = convertSecondsToTime(views);
        console.log(time);
        

        

        

        const videoCard = document.createElement('div');

        videoCard.innerHTML=`
        <div class="relative">
            <div class="w-[312px] h-[200px] rounded-lg">
                <img class="w-[312px] h-[200px] rounded-lg" src="${item.thumbnail}" alt="${item.title}" >
            </div>
            ${time.years > 0 ? `<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.years}</span>years ago</p>
                </div>`: time.months > 0 ? `<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.months}</span>months ago</p>
                </div>`: time.days > 0 ? `<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.days}</span>days ago</p>
                </div>`: time.hours > 0 ? `<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.hours}</span>hrs <span>${time.minutes}</span>min ago</p>
                </div>`: time.minutes > 0?`<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.minutes}</span>minutes <span>${time.seconds}</span>sec ago</p>
                </div>`:time.seconds > 0  ?`<div id="time" class=" bg-[#171717] rounded-sm h-5  w-[90px] text-[#fff] text-[10px] absolute left-[213px] bottom-[12px]">
                <p id="time-text" class="text-center pt-[2px]"><span>${time.secons}</span>sec ago</p>
                </div>`:''
            }
            
        </div>

        <div class="flex gap-[12px] mt-[20px]">
            <div class="w-[40px] h-[40px] rounded-full ">
                <img src="${item.authors[0].profile_picture}" alt="${item.authors[0].profile_name}" class="w-[40px] h-[40px] rounded-full">
            </div>
            <div>
                <h1 class="text-[16px] font-bold w-[260px] mb-[9px]">${item.title}</h1>
                    <div class="flex gap-[9px] text-[14px] text-[#252525B3] mb-[10px]">
                        <p>${item.authors[0].profile_name}</p>
                        ${item.authors[0].verified === true ? `<figure id="figure-section">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <g clip-path="url(#clip0_11_34)">
                                    <path d="M19.375 10.0001C19.375 10.8001 18.3922 11.4595 18.1953 12.197C17.9922 12.9595 18.5063 14.022 18.1203 14.6892C17.7281 15.3673 16.5484 15.4486 15.9984 15.9986C15.4484 16.5486 15.3672 17.7282 14.6891 18.1204C14.0219 18.5064 12.9594 17.9923 12.1969 18.1954C11.4594 18.3923 10.8 19.3751 10 19.3751C9.2 19.3751 8.54062 18.3923 7.80312 18.1954C7.04062 17.9923 5.97813 18.5064 5.31094 18.1204C4.63281 17.7282 4.55156 16.5486 4.00156 15.9986C3.45156 15.4486 2.27187 15.3673 1.87969 14.6892C1.49375 14.022 2.00781 12.9595 1.80469 12.197C1.60781 11.4595 0.625 10.8001 0.625 10.0001C0.625 9.20012 1.60781 8.54075 1.80469 7.80325C2.00781 7.04075 1.49375 5.97825 1.87969 5.31106C2.27187 4.63293 3.45156 4.55168 4.00156 4.00168C4.55156 3.45168 4.63281 2.272 5.31094 1.87981C5.97813 1.49387 7.04062 2.00793 7.80312 1.80481C8.54062 1.60793 9.2 0.625122 10 0.625122C10.8 0.625122 11.4594 1.60793 12.1969 1.80481C12.9594 2.00793 14.0219 1.49387 14.6891 1.87981C15.3672 2.272 15.4484 3.45168 15.9984 4.00168C16.5484 4.55168 17.7281 4.63293 18.1203 5.31106C18.5063 5.97825 17.9922 7.04075 18.1953 7.80325C18.3922 8.54075 19.375 9.20012 19.375 10.0001Z" fill="#2568EF"/>
                                    <path d="M12.7094 7.20637L9.14062 10.7751L7.29062 8.92668C6.88906 8.52512 6.2375 8.52512 5.83594 8.92668C5.43437 9.32824 5.43437 9.97981 5.83594 10.3814L8.43125 12.9767C8.82187 13.3673 9.45625 13.3673 9.84687 12.9767L14.1625 8.66106C14.5641 8.25949 14.5641 7.60793 14.1625 7.20637C13.7609 6.80481 13.1109 6.80481 12.7094 7.20637Z" fill="#FFFCEE"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_11_34">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            </figure>`:''
                        }
                        
                    </div>
                <p class="text-[14px] text-[#252525B3]"><span>${item.others.views}</span> views</p>
            </div>
        </div>
        `;
        video.appendChild(videoCard);
        contronLoading(false);

    }

    
}


const allCateogory = async() => {
    if(navigator.onLine){
        contronLoading(true);
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.add('hidden');
    }
    else{
        oflineLoading(); 
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.remove('hidden');
    }
    const video = document.getElementById('video');
    video.innerText ='';
    const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const responseData = await response.json();
    const categoryName = "All";
    const istrue = true;

    for (const category of responseData.data) {
        if (category.category === categoryName) {
            console.log(category.category_id);
            loadVideo(category.category_id,istrue);
        }
    }
    
}
//no-data-view
const musicCateogory = async() =>{
    if(navigator.onLine){
        contronLoading(true);
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.add('hidden');
    }  
    else{
        oflineLoading(); 
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.remove('hidden');
    }  
    const video = document.getElementById('video');
    video.innerText ='';

    const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const responseData = await response.json();
    const categoryName = "Music";
    const istrue = true;

    for (const category of responseData.data) {
        if (category.category === categoryName) {
            console.log(category.category_id);
            loadVideo(category.category_id,istrue);
        }
    }
}

const comedyCateogory = async() =>{
    if(navigator.onLine){
        contronLoading(true);
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.add('hidden');
    }
    else{
        oflineLoading(); 
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.remove('hidden');
    }
    const video = document.getElementById('video');
    video.innerText ='';

    const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const responseData = await response.json();
    const categoryName = "Comedy";
    const istrue = true;

    for (const category of responseData.data) {
        if (category.category === categoryName) {
            console.log(category.category_id);
            loadVideo(category.category_id,istrue);
        }
    }
}

const drawingCateogory = async()=>{
    if(navigator.onLine){
        contronLoading(true);  
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.add('hidden');
    } 
    else{
        oflineLoading(); 
        const noInternet = document.getElementById('no-internet');
        noInternet.classList.remove('hidden');
    }
    const video = document.getElementById('video');
    video.innerText ='';
    const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const responseData = await response.json();
    const categoryName = "Drawing";
    const istrue = true;

    for (const category of responseData.data) {
        if (category.category === categoryName) {
            console.log(category.category_id);
            loadVideo(category.category_id,istrue);
        }
    }
}

function btnColorChange(){
    var header = document.getElementById("btn-section");
    var btns = header.getElementsByClassName("button");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("activeMore");
        current[0].className = current[0].className.replace(" activeMore", "");
        this.className += " activeMore";
        });
    }
}

function redirectToBlogPage() {
    window.location.href = 'blog.html';
}

function redirectToHomePage() {
    window.location.href = 'index.html';
}

function contronLoading(isLoading) {
    const loading = document.getElementById('loading-section');
    if (isLoading) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function checkInternetConnection() {
    const noInternet = document.getElementById('no-internet');
    const noData = document.getElementById('no-data-view');
    if (!navigator.onLine) {
        noInternet.classList.remove('hidden')
        const video = document.getElementById('video');
        video.innerText ='';
        noData.classList.add('hidden');
    } else {
        noInternet.classList.add('hidden');
        noData.classList.remove('hidden');
    }
}


function oflineLoading() {
    const oflineLoading = document.getElementById('oflineLoading');
    const noData = document.getElementById('no-data-view');
    if (!navigator.onLine) {
        oflineLoading.classList.remove('hidden')
        const video = document.getElementById('video');
        video.innerText ='';
        noData.classList.add('hidden');
    } else {
        oflineLoading.classList.add('hidden')
        noData.classList.remove('hidden');
    }
}


setTimeout(function () {
    oflineLoading();

    // After 30 seconds, hide the offlineLoading element
    setTimeout(function () {
        const offlineLoading = document.getElementById('offlineLoading');
        offlineLoading.classList.add('hidden');
    }, 30 * 1000); // 30 seconds in milliseconds
}, 0);


// function showOfflineMessage() {
//     const offlineLoading = document.getElementById('offlineLoading');
//     offlineLoading.classList.add('block');
//     setTimeout(() => {
//         offlineLoading.classList.remove('block');
//     }, 30 * 1000); // 30 seconds in milliseconds
// }









// Initial loading control
contronLoading(true);

//After 2 minutes, check internet connection
setTimeout(function () {
    // Check internet connection
    checkInternetConnection();
}, 0.5 * 60 * 1000); // 2 minutes in milliseconds

function reLoadPage(){
    location.reload();
}



btnColorChange();


loadVideo(false);
