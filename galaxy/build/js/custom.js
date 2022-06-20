let starTrigger;

document.onmousemove = function(event) {
	positionX = event.pageX;
	positionY = event.pageY;
    let mousePositions = [positionX, positionY];
}

const clickStarEvent = new CustomEvent("isClickStar");

document.addEventListener(clickStarEvent, function () {
    console.log(mousePositions);
});

switch (starTrigger)
{
    case (1):
        document.dispatchEvent(clickStarEvent);
    case (2):
        
}