import type { Piece } from "./piece";

export type Move = {
	start: number[];
	end: number[];
	piece: Piece
};
