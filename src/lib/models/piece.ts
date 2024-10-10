export class Piece {
	color: "white" | "black";
	is_king: boolean;
	position: number[];

	constructor(color: "white" | "black", position: number[]) {
		this.color = color;
		this.is_king = false;
		this.position = position;
	}

	updateKing() {
		this.is_king = true;
	}
}
