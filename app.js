async function loadJSON(path){
 const res = await fetch(path);
 return res.json();
}

document.addEventListener("DOMContentLoaded", init);

async function init(){

 if(!location.pathname.includes("calculator")) return;

 const tours = await loadJSON("data/tours.json");
 const guides = await loadJSON("data/guides.json");
 const season = await loadJSON("data/season.json");

 const tourSelect = document.getElementById("tour");
 const guideSelect = document.getElementById("guide");

 tours.forEach((t,i)=>{
  const opt=document.createElement("option");
  opt.value=i;
  opt.text=t.title;
  tourSelect.appendChild(opt);
 });

 guides.forEach((g,i)=>{
  const opt=document.createElement("option");
  opt.value=i;
  opt.text=g.name;
  guideSelect.appendChild(opt);
 });

 document.getElementById("calculate").onclick=()=>{

  const people = Number(document.getElementById("people").value);
  const date = document.getElementById("date").value;

  const tour = tours[tourSelect.value];
  const guide = guides[guideSelect.value];

  const totalDays = tour.days;
  const guidesCount = Math.ceil(people/4);

  let total =
    tour.price +
    (guidesCount * guide.price * totalDays);

  const multiplier = getSeasonMultiplier(date, season);

  total = Math.round(total * multiplier);

  document.getElementById("result").innerText =
    "Total: $" + total;

 };

}

function getSeasonMultiplier(date,season){

 if(!date) return 1;

 const d = date.slice(5);

 if(d >= season.seasonStart && d <= season.seasonEnd)
  return season.high;

 return season.low;
}
