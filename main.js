let play='reboot';
let nextCountArgs;
//reset button on julkinen muuttuja

window.onload=function(){
    //luodaan ajastimille omat elementit 
    let timeElement=document.querySelector('.time');
    timeElement.originalTime=600000;
    timeElement.time=600000;
    timeElement.name='timeElement';
    
    let clockElement=document.querySelector('.clock');
    clockElement.name='clockElement'

    breakElement=document.querySelector('.break');
    breakElement.originalTime=300000;
    breakElement.time=300000;
    breakElement.name='breakElement';

    //luodaan nappuloille omat elementit
    resetButton=document.querySelector('#reset');
    let addMinute=document.querySelector('#addMinute');
    let decreaseMinute=document.querySelector('#decreaseMinute');
    let addMinuteBreak=document.querySelector('#addMinuteBreak');
    let decreaseMinuteBreak=document.querySelector('#decreaseMinuteBreak');
    let switchKey=document.querySelector('#switch');
    
    //luodaan event listenerit nappuloille
    
    addMinute.addEventListener('click',()=>{
        changeTime(timeElement,60000,clockElement);
    });
    decreaseMinute.addEventListener('click',()=>{
        changeTime(timeElement,-60000,clockElement);
        }
    );    
    addMinuteBreak.addEventListener('click',()=>{
        changeTime(breakElement,60000);
    });
    
    decreaseMinuteBreak.addEventListener('click',()=>{
        changeTime(breakElement,-60000);
        }
    );

    resetButton.addEventListener('click',()=>{
        play='reboot';
        initTimers(clockElement,timeElement,breakElement);
        
    });

    switchKey.addEventListener('click',()=>{
        play=play==true?false:true;
        if(play){
            count(...nextCountArgs);
        }
    });

    // alustetaan kello
    initTimers(clockElement,timeElement,breakElement);
    nextCountArgs=[clockElement,timeElement,breakElement];
};
function initTimers(clockElement,timeElement,breakElement){
    timeElement.time=timeElement.originalTime;
    breakElement.time=breakElement.originalTime;
    changeTime(timeElement);
    changeTime(clockElement,timeElement.time);
    changeTime(breakElement);
    //laitetaan kello valmiustilaan
    nextCountArgs=[clockElement,timeElement,breakElement];
}

//luodaan laskemiselle funktio 
function count(clockElement,timeElement,nextElement,runTime=null){
    
    if(runTime==null){
        runTime=timeElement.time;
    }

    if(play=='reboot'){
        resetButton.dispatchEvent(new Event('click'));
    }
    
    else if (runTime<=0){
        alarm(clockElement)
        .then(()=>{
            count(clockElement,nextElement,timeElement);
        })
    }
    else{
        if(play==true){
            //jotta ruutu paivittyy, pistetaan set timeout 
            setTimeout(()=>{
                runTime=runTime-1000;
                changeTime(clockElement,runTime);
                count(clockElement,timeElement,nextElement,runTime);
            },1000);
        }
        else{
            nextCountArgs=[clockElement,timeElement,nextElement,runTime];
        }       
    }
}

function alarm(timeElement){
    audio=document.createElement('audio');
    audio.src='./alarm.wav';
    audio.volume=0.2;
    audio.play();
    timeElement.style.color='red';
    // muuta time-elemenetin tausta punaiseksi ja lopeta kun audio on ohi 
    return new Promise((resolve)=>{
        audio.addEventListener('timeupdate',()=>{
            if(audio.currentTime>3||play=='reboot'){
                timeElement.style.color='black';
                audio.pause();
                resolve();
            }
        });
    })
}

//luodaan ajan vaihdolle funktio
function changeTime(timeElement,runTime=null,clockElement){ 
    
    let htmlTime;
    
    if(runTime==null){
        htmlTime=timeElement.time;
    }
    else if((timeElement.time+runTime>=60000)&&(timeElement.name!='clockElement')){
    timeElement.time=timeElement.time+runTime;
    htmlTime=timeElement.time;

        if((clockElement)&&(play=='reboot')){
            clockElement.time=timeElement.time;
            changeTime(clockElement);
            nextCountArgs=[clockElement,timeElement,breakElement];
        }
    }
    else if (timeElement.name=='clockElement'){
    htmlTime=runTime;
    }
    
    else{
        return;
    }

    let TimeInSeconds=(htmlTime/1000);
    let TimeInMinutes=Math.floor(TimeInSeconds/60);
    let seconds=TimeInSeconds%60;
    let hours=Math.floor(TimeInMinutes/60);
    let minutes=TimeInMinutes-hours*60;
    timeElement.innerHTML=hours+'h:'+minutes+'m:'+seconds+'s';
};


