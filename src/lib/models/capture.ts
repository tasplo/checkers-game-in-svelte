import type { Piece } from "./piece";

export type Capture = {
	start: number[];
	end: number[];
	fallen: {
		position: number[];
	};
	piece: Piece
};
