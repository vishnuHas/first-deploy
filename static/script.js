gsap.registerPlugin(ScrollTrigger) 
gsap.from(".hj",{
  scrollTrigger:{
    trigger:".hj",
    toggleActions:"restart none none none"
  },
  x:700,
  duration: 3,
});

gsap.from(".en",{
  y:700,
  duration: 3,
 });

 gsap.from(".page1",{
  y:-700,
  duration: 3,
 });



 gsap.from(".jh p",{
  scrollTrigger:{
    trigger:".jh p",
    toggleActions:"restart"
  },
  y:-700,
  duration: 3,
 });

 gsap.from(".kl",{
  scrollTrigger:{
  trigger:".kl",
  toggleActions:"restart",
  },
  x:-700,
  duration: 3,
 });

 gsap.from(".img3",{
  scrollTrigger:{
    trigger:".kl",
    toggleActions:"restart",
  },
  y:-700,
  duration: 2,
 });


var textWrapper = document.querySelector('.ml6 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml6 .letter',
    translateY: ["1.1em", 0],
    translateZ: 0,
    duration: 750,
    delay: (el, i) => 50 * i
  }).add({
    targets: '.ml6',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


  var textWrapper = document.querySelector('.ml4 .letterss');
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letterss'>$&</span>");
  
  anime.timeline({loop: true})
    .add({
      targets: '.ml4 .letter',
      scale: [0, 1],
      duration: 1000,
      elasticity: 600,
      delay: (el, i) => 45 * (i+1)
    }).add({
      targets: '.ml4',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });
  