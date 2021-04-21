var carousel = null;
var cells = [];
var cellCount; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = 0;
var cellHeight = 0;
var isHorizontal = true;
var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
var radius, theta;
var prevButton;
var nextButton;
var cellsRange;
var orientationRadios;

$(document).ready(function () {
    carousel = document.querySelector('.carousel');
    cells = carousel.querySelectorAll('.carousel__cell');
    cellCount; // cellCount set from cells-range input value
    selectedIndex = 0;
    cellWidth = carousel.offsetWidth;
    cellHeight = carousel.offsetHeight;
    isHorizontal = true;
    rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
    radius, theta;

    prevButton = document.querySelector('.previous-button');
    prevButton.addEventListener('click', function () {
        selectedIndex--;
        rotateCarousel();
    });

    nextButton = document.querySelector('.next-button');
    nextButton.addEventListener('click', function () {
        selectedIndex++;
        rotateCarousel();
    });

    cellsRange = document.querySelector('.cells-range');
    cellsRange.addEventListener('change', changeCarousel);
    cellsRange.addEventListener('input', changeCarousel);
    orientationRadios = document.querySelectorAll('input[name="orientation"]');
    (function () {
        for (var i = 0; i < orientationRadios.length; i++) {
            var radio = orientationRadios[i];
            radio.addEventListener('change', onOrientationChange);
        }
    })();

    // set initials
    onOrientationChange();

    window.setInterval(function () {
        selectedIndex++;
        rotateCarousel(); }, 3000);
    cellsRange.value = 15;
    cellsRange.dispatchEvent(new Event("change"));
});
function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform = 'translateZ(' + -radius + 'px) ' + 
    rotateFn + '(' + angle + 'deg)';
}



function changeCarousel() {
  cellCount = cellsRange.value;
  theta = 360 / cellCount;
  var cellSize = isHorizontal ? cellWidth : cellHeight;
  radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / cellCount ) );
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    if ( i < cellCount ) {
      // visible cell
      cell.style.opacity = 1;
      var cellAngle = theta * i;
      cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
    } else {
      // hidden cell
      cell.style.opacity = 0;
      cell.style.transform = 'none';
    }
  }

  rotateCarousel();
}

function onOrientationChange() {
  var checkedRadio = document.querySelector('input[name="orientation"]:checked');
  isHorizontal = checkedRadio.value === 'horizontal';
  rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
  changeCarousel();
}

