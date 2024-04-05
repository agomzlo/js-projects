import { PEOPLE } from './people.js';

const DECISION_THRESHOLD = 120;
const $cards = document.getElementById('cards');
let isAnimating = false;
let deltaX = 0;

PEOPLE.forEach(person => {
  const card = document.createElement('article');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${person.image}" alt="${person.description}">
    <h2>${person.name} <span>${person.age}</span></h2>
    <div class="choice nope" id="choiceNope">NOPE</div>
    <div class="choice like" id="choiceLike">LIKE</div>
  `;
  $cards.appendChild(card);
});

function startDrag(event){
  if (isAnimating) return;

  // Get the card that was clicked
  const actualCard = event.target.closest('article');
  if (!actualCard) return;

  //Get initial position of mouse or finger
  const startX = event.pageX || event.touches[0].pageX;

  //Listen for mousemove or touchmove
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, {passive: true});

  //Listen for mouseup or touchend
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);

  function onMove(event){
    //Get current position of mouse or finger
    const currentX = event.pageX || event.touches[0].pageX;
  
    //Calculate the distance moved
    deltaX = currentX - startX;

    if (deltaX === 0) return;

    //Change the const to indicate that the card is being animated
    isAnimating = true;

    //Move the card
    const cardDeg = deltaX / 15;

    // if (!actualCard) return;

    actualCard.style.transform = `translateX(${deltaX}px) rotate(${cardDeg}deg)`;
    actualCard.style.cursor = 'grabbing';

    //Change the opacity of the choice
    const opacity = Math.abs(deltaX) / 100;
    const goRight = deltaX >= 0;

    const choice = goRight
      ? actualCard.querySelector('.choice.like')
      : actualCard.querySelector('.choice.nope');

    choice.style.opacity = opacity;
  }
  
  function onEnd(event){
    //Remove the event listeners
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchend', onEnd);

    //Know the user decision
    const userDecision = Math.abs(deltaX) >= DECISION_THRESHOLD;

    // if (!actualCard) return;

    if (userDecision){
      const goRight = deltaX >= DECISION_THRESHOLD;

      actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      actualCard.addEventListener('transitionend', () => {
        actualCard.remove();
      }, {once: true});
    }else{
      actualCard.classList.add('reset');
      actualCard.classList.remove('go-right', 'go-left');
    }

    //Reset the variables
    actualCard.addEventListener('transitionend', () => {
      actualCard.removeAttribute('style');
      actualCard.classList.remove('reset');

      deltaX = 0;
      isAnimating = false;
    })

    //Reset the choise opacity
    actualCard.querySelectorAll('.choice')
    .forEach(choice => choice.style.opacity = 0);
  }
}

document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, {passive: true});