// $ helyett document.querySelector és már meg is szabadultál a jQuery függőségtől

function buttonAddClickHandler(buttonQuery, listener) {
  const button = document.querySelector(buttonQuery);
  if (!button) return;
  button.addEventListener('click', listener);  
}

// nem kell bind-elni, mert egy ideje már ott az arrow function.
buttonAddClickHandler('.keres', () => alert('click'));

// ezután meg tovább lehet gondolni, hogy írhatjuk általánosabbra

// csinálhatunk pld, egy tetszőleges eseményre feliratkozó függvényt
const addEventFactory = eventName => (query, listener) => {
  const element = document.querySelector(query);
  if (!element) return () => {}; // ha nincs akire feliratkozzon akkor leiratkozni se kell
  element.addEventListener(eventName, listener);
  // aminek a visszatérési értéke a leiratkozás, ami később jól jöhet
  return () => element.removeEventListener(eventName, listener);
};

// akkor már csak le kell gyártani a click esemény felrakó függvényt
import {addEventFactory} from "...";

const addClick = addEventFactory('click');
// de pld lehet vele billentyű leütésre is feliratkozni
const addKeyDown = addEventFactory('keydown');

// lehet használni
import {addClick} from "...";
const eventRemovers = [];

eventRemovers.push(
  addClick('.keres', () => alert('click'))
);

// ha a komponensünk használata lejár akár le is iratkozhatunk az eseménykezelőkről
eventRemovers.forEach(removeEvent => removeEvent());