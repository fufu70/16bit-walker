export function moveTowards(sprite, destinationPosition, speed) {
	let distanceToTravelX = destinationPosition.x - sprite.position.x;
	let distanceToTravelY = destinationPosition.y - sprite.position.y;
	let distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);

	if (distance <= speed) {
		sprite.position.x = destinationPosition.x;
		sprite.position.y = destinationPosition.y;
	} else {
		let normalizeX = distanceToTravelX / distance;
		let normalizeY = distanceToTravelY / distance;
		sprite.position.x += normalizeX * speed;
		sprite.position.y += normalizeY * speed;
		distance = Math.sqrt(distanceToTravelX ** 2 + distanceToTravelY ** 2);
	}
	return distance;
}

