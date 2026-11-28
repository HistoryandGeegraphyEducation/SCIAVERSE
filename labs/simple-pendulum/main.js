(() => {
  'use strict';
  const byId=id=>document.getElementById(id);
  const lengthInput=byId('pendulumLength');
  const gravityInput=byId('pendulumGravity');
  const massInput=byId('pendulumMass');
  const angleInput=byId('pendulumAngle');
  const string=byId('pendulumString');
  const bob=byId('pendulumBob');
  const play=byId('pendulumPlay');
  const pause=byId('pendulumPause');
  const reset=byId('pendulumReset');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

  let time=0,running=false,frameId=0,lastFrame=0,length=1,gravity=9.80665,angle=10;
  const format=(value,digits=2)=>value.toFixed(digits).replace('.',',');

  function updateValues(){
    length=Number(lengthInput.value);
    gravity=Number(gravityInput.value);
    angle=Number(angleInput.value);
    const mass=Number(massInput.value);
    const period=2*Math.PI*Math.sqrt(length/gravity);
    const frequency=1/period;
    byId('pendulumLengthValue').textContent=format(length);
    byId('pendulumGravityValue').textContent=format(gravity,5);
    byId('pendulumMassValue').textContent=format(mass,1);
    byId('pendulumAngleValue').textContent=String(angle);
    byId('pendulumPeriod').textContent=format(period,3);
    byId('pendulumFrequency').textContent=format(frequency,3);
    const visualLength=105+((length-.2)/1.8)*105;
    string.setAttribute('y2',String(24+visualLength));
    bob.setAttribute('cy',String(24+visualLength));
    draw();
  }

  function draw(){
    const omega=Math.sqrt(gravity/length);
    const theta=angle*Math.PI/180*Math.cos(omega*time);
    const degrees=theta*180/Math.PI;
    string.setAttribute('transform','rotate('+degrees+' 180 24)');
    bob.setAttribute('transform','rotate('+degrees+' 180 24)');
  }

  function setButtons(){
    play.disabled=running;
    pause.disabled=!running;
  }

  function stop(){
    running=false;
    if(frameId)cancelAnimationFrame(frameId);
    frameId=0;lastFrame=0;
    setButtons();
  }

  function tick(now){
    if(!running)return;
    if(!lastFrame)lastFrame=now;
    const delta=Math.min(.06,(now-lastFrame)/1000);
    lastFrame=now;
    time+=delta;
    draw();
    frameId=requestAnimationFrame(tick);
  }

  function start(){
    if(running)return;
    if(reducedMotion.matches){
      time=0;
      draw();
    }
    running=true;lastFrame=0;setButtons();
    frameId=requestAnimationFrame(tick);
  }

  function resetModel(){
    stop();time=0;draw();
  }

  [lengthInput,gravityInput,massInput,angleInput].forEach(input=>{
    input.addEventListener('input',updateValues);
  });
  play.addEventListener('click',start);
  pause.addEventListener('click',stop);
  reset.addEventListener('click',resetModel);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      if(frameId)cancelAnimationFrame(frameId);
      frameId=0;lastFrame=0;
    }else if(running){
      frameId=requestAnimationFrame(tick);
    }
  });
  window.addEventListener('pagehide',stop,{once:true});
  updateValues();
  setButtons();
})();
