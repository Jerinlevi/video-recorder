let video=document.querySelector("video");
let recordBtnCont=document.querySelector(".record-btn-cont")
let recordBtn=document.querySelector(".record-btn")
let recordFlag=false;
let captureBtnele=document.querySelector(".capture-btn-cont")
let captureBtn=document.querySelector(".capture-btn")
let transparent="transparent";
let recorder;//store undefined
let chunks=[];//media data are stored in a chunks
let constraints={
    audio:true,
    video:true,
}
//navigator is an global obj where this gives the browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{

    video.srcObject=stream;
    recorder=new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        let blob =new Blob(chunks,{type:"video/mp4"});
        let videoUrl=URL.createObjectURL(blob);
        let a =document.createElement('a');
        a.href=videoUrl;
        a.download="stream.mp4"
        a.click();
    })
    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;
        recordFlag=!recordFlag;
        if(recordFlag){//start
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();

        }else{
            recorder.stop();
            recordBtn.classList.remove("scale-record");
            stopTimer();
        }
    })
});


captureBtnele.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    let imageUrl=canvas.toDataURL("image/jpeg",0.1);
    let getting=canvas.getContext("2d");
    getting.drawImage(video,0,0,canvas.width,canvas.height);
    getting.fillStyle=transparent;
    getting.fillRect(0,0,canvas.width,canvas.height);
    let a =document.createElement('a');
    a.href=imageUrl;
    a.download="stream.jpeg"
    a.click();
    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");

    },500);
})

let timerId;
let counter=0;
let timer=document.querySelector(".timer")
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        let totalSeconds=counter;
        let hours=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;
        let minutes=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;
        let seconds=totalSeconds;
        hours=(hours < 10) ?`0${hours}`:hours;
        minutes=(minutes < 10) ?`0${minutes}`:minutes;
        seconds=(seconds < 10) ?`0${seconds}`:seconds;
        timer.innerText=`${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerId=setInterval(displayTimer,1000);
}
function stopTimer(){
     clearInterval(timerId);
     timer.style.display="none";
     counter=0;
}
let filter=document.querySelector(".filter1")
let all=document.querySelectorAll(".filter");
all.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        transparent=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor=transparent;
    })
});
