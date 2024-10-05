import type { Capture } from "./capture";
import type { Move } from "./move";
import { Piece } from "./piece";

export class Checkers {
	board: (Piece | null)[][];
	current_player: "white" | "black";

	cursor_log: number[][];
	selected_square: number[];

	in_capture_state: boolean;
	must_capture: boolean;
	capture_positions: number[][];
	captures: Capture[];
	capture_allowed: boolean;
	active_capture_piece: Piece | null;

	active_move_piece: Piece | null;
	moves: Move[];
	move_allowed: boolean;

	game_over: boolean;

	constructor() {
		this.board = this.initializeBoard();
		this.current_player = "black";
		this.cursor_log = [];
		this.selected_square = [];

		this.in_capture_state = false;
		this.must_capture = false;
		this.capture_positions = [];
		this.captures = [];
		this.capture_allowed = true;
		this.active_capture_piece = null;

		this.active_move_piece = null;
		this.moves = [];
		this.move_allowed = true;

		this.game_over = false;
	}

	initializeBoard() {
		const board: (Piece | null)[][] = Array(8)
			.fill(null)
			.map(() => Array(8).fill(null));
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 8; col += 2) {
				const [r, c] = [row, col + ((row + 1) % 2)];
				board[r][c] = new Piece("white", [r, c]);
			}
		}
		for (let row = 5; row < 8; row++) {
			for (let col = 0; col < 8; col += 2) {
				const [r, c] = [row, col + ((row - 1) % 2)];
				board[r][c] = new Piece("black", [r, c]);
			}
		}
		return board;
	}

	updateCursorLog(position: number[]) {
		if (this.cursor_log.length) {
			if (this.cursor_log[this.cursor_log.length - 1].toString() !== position.toString()) {
				this.cursor_log.push(position);
			} else {
				if (!this.in_capture_state) {
					this.cursor_log.length = 0;
				}
			}
		} else {
			this.cursor_log.push(position);
		}
	}

	selectSquare() {
		if (this.cursor_log.length !== 0) {
			const [row, col] = this.cursor_log[this.cursor_log.length - 1];
			if (this.board[row][col]?.color === this.current_player) {
				if (!this.must_capture) {
					const has_move = this.moves.some(
						(_move) => _move.start.toString() === [row, col].toString()
					);
					if (has_move) {
						this.selected_square = [row, col];
						this.active_move_piece = this.board[row][col];
					} else {
						this.cursor_log.length = 0;
						this.selected_square.length = 0;
					}
				} else {
					this.selected_square = [row, col];
					const is_capture_square = this.capture_positions.some(
						(capture) => capture.toString() === this.selected_square.toString()
					);
					if (!is_capture_square) {
						this.selected_square.length = 0;
					} else {
						this.active_capture_piece = this.board[row][col];
					}
				}
			} else {
				if (!this.in_capture_state) {
					this.selected_square = [];
				}
			}
		} else {
			this.selected_square = [];
		}
	}

	generateMoves() {
		this.board.forEach((row) => {
			row.forEach((piece) => {
				if (piece) {
					if (piece.color === this.current_player) {
						if (piece.is_king) {
							this.kingMoves(piece);
						} else {
							this.pawnMoves(piece);
						}
					}
				}
			});
		});
		if (this.moves.length === 0) {
			this.game_over = true;
		}
	}

	kingMoves(piece: Piece) {
		const [row, col] = piece.position;

		const addMove = (row_offset: number, col_offset: number) => {
			this.moves.push({
				start: [row, col],
				end: [row_offset, col_offset],
				piece
			});
			this.move_allowed = false;
		};

		const directions = [
			[1, -1],
			[1, 1],
			[-1, -1],
			[-1, 1]
		];

		for (const [r, c] of directions) {
			const [new_row, new_col] = [row + r, col + c];
			if (new_row >= 0 && new_row < 8 && new_col >= 0 && new_col < 8) {
				if (this.board[new_row][new_col] === null) {
					addMove(new_row, new_col);
				}
			}
		}
	}

	pawnMoves(piece: Piece) {
		const [row, col] = piece.position;

		const addMove = (row_offset: number, col_offset: number) => {
			this.moves.push({
				start: [row, col],
				end: [row_offset, col_offset],
				piece
			});
			this.move_allowed = false;
		};

		const direction = piece.color === "white" ? 1 : -1;

		if (row + direction >= 0 && row + direction < 8) {
			if (col - 1 >= 0 && this.board[row + direction][col - 1] === null) {
				addMove(row + direction, col - 1);
			}
			if (col + 1 < 8 && this.board[row + direction][col + 1] === null) {
				addMove(row + direction, col + 1);
			}
		}
	}

	movePiece() {
		if (this.moves.length) {
			if (this.cursor_log.length > 1) {
				const [r, c] = this.cursor_log[this.cursor_log.length - 2];
				const [row, col] = this.cursor_log[this.cursor_log.length - 1];
				this.moves.forEach((move) => {
					if (move.start.toString() === [r, c].toString()) {
						if (move.end.toString() === [row, col].toString()) {
							move.piece.position = [row, col];
							this.board[row][col] = move.piece;

							this.board[r][c] = null;
							this.moves.length = 0;
							this.cursor_log.length = 0;

							this.move_allowed = true;
							this.capture_allowed = true;
							this.switchTurn();
						}
					}
				});
			}
		}
	}

	clearCaptures() {
		this.captures.length = 0;
		this.capture_positions.length = 0;
	}

	generateCaptures() {
		const checkCapture = (piece: Piece) => {
			if (piece.is_king) {
				this.kingCaptures(piece);
			} else {
				this.pawnCaptures(piece);
			}
			this.capture_allowed = false;
		};

		this.clearCaptures();
		if (!this.in_capture_state) {
			this.board.forEach((row) => {
				row.forEach((piece) => {
					if (piece) {
						if (piece.color === this.current_player) {
							checkCapture(piece);
						}
					}
				});
			});
		} else {
			if (this.active_capture_piece) {
				if (this.active_capture_piece.color === this.current_player) {
					checkCapture(this.active_capture_piece);
				}
			}
		}
	}

	kingCaptures(piece: Piece) {
		const [_r, _c] = piece.position;
		const board_size = this.board.length;

		const visited = new Set();
		const queue: number[][] = [[_r, _c]];
		const taken_route = [];

		let has_capture = false;

		while (queue.length > 0) {
			const position = queue.shift();

			if (position === undefined) {
				return;
			}
			const [row, col] = position;

			if (visited.has(`${row}-${col}`)) {
				continue;
			}

			visited.add(`${row}-${col}`);
			const offsets = [-2, 2];

			for (const r_offset of offsets) {
				for (const c_offset of offsets) {
					const [end_row, end_col] = [row + r_offset, col + c_offset];
					const [r, c] = [row + r_offset / 2, col + c_offset / 2];
					if (end_row >= 0 && end_row < board_size) {
						if (end_col >= 0 && end_col < board_size) {
							if (this.board[r][c] !== null) {
								if (this.board[r][c].color !== piece.color) {
									if (
										taken_route.length === 0 ||
										(taken_route.length !== 0 &&
											taken_route[taken_route.length - 1].toString() !== [r, c].toString())
									) {
										if (this.board[end_row][end_col] === null) {
											this.captures.push({
												start: [row, col],
												end: [end_row, end_col],
												fallen: {
													position: [r, c]
												},
												piece
											});
											queue.push([end_row, end_col]);
											taken_route.push([r, c]);
											has_capture = true;
										}
									}
								}
							}
						}
					}
				}
			}
		}

		if (has_capture) {
			this.must_capture = true;
			this.capture_positions.push(piece.position);
		}
	}

	pawnCaptures(piece: Piece) {
		const [_r, _c] = piece.position;
		const opponet = piece.color === "white" ? "black" : "white";
		const queue: number[][] = [[_r, _c]];
		const visited = new Set();

		let has_capture = false;

		while (queue.length !== 0 && queue !== undefined) {
			const position = queue.shift();

			if (position === undefined) {
				return;
			}
			const [row, col] = position;

			if (visited.has(`${row}-${col}`)) {
				continue;
			}

			visited.add(`${row}-${col}`);

			const player = piece.color === "black";

			if ((player && row - 2 > -1) || (!player && row + 2 < 8)) {
				if (col - 2 > -1) {
					if (this.board[row + (player ? -2 : 2)][col - 2] === null) {
						if (this.board[row + (player ? -1 : 1)][col - 1]?.color === opponet) {
							this.captures.push({
								start: [row, col],
								end: [row + (player ? -2 : 2), col - 2],
								fallen: {
									position: [row + (player ? -1 : 1), col - 1]
								},
								piece
							});
							queue.push([row + (player ? -2 : 2), col - 2]);
							has_capture = true;
						}
					}
				}
				if (col + 2 < 8) {
					if (this.board[row + (player ? -2 : 2)][col + 2] === null) {
						if (this.board[row + (player ? -1 : 1)][col + 1]?.color === opponet) {
							this.captures.push({
								start: [row, col],
								end: [row + (player ? -2 : 2), col + 2],
								fallen: {
									position: [row + (player ? -1 : 1), col + 1]
								},
								piece
							});
							queue.push([row + (player ? -2 : 2), col + 2]);
							has_capture = true;
						}
					}
				}
			}
		}
		if (has_capture) {
			this.must_capture = true;
			this.capture_positions.push(piece.position);
		}
	}

	capturePiece() {
		if (this.must_capture) {
			if (this.cursor_log.length > 1) {
				const [old_row, old_col] = this.cursor_log[this.cursor_log.length - 2];
				const [new_row, new_col] = this.cursor_log[this.cursor_log.length - 1];
				let capture_piece = null;
				if (!this.in_capture_state) {
					const capture_pos = this.capture_positions.find(
						(pos) => pos.toString() === [old_row, old_col].toString()
					);
					if (capture_pos) {
						capture_piece = this.captures.find(
							(capture) =>
								capture.start.toString() === capture_pos.toString() &&
								capture.end.toString() === [new_row, new_col].toString()
						);
					}
				}
				if (this.in_capture_state) {
					if (this.active_capture_piece?.position.toString() === [old_row, old_col].toString()) {
						capture_piece = this.captures.find(
							(capture) =>
								capture.start.toString() === this.active_capture_piece?.position.toString() &&
								capture.end.toString() === [new_row, new_col].toString()
						);
					}
				}
				if (capture_piece) {
					const first_capture = [capture_piece.end];

					this.board[capture_piece.fallen.position[0]][capture_piece.fallen.position[1]] = null;
					capture_piece.piece.position = [new_row, new_col];
					this.board[new_row][new_col] = capture_piece.piece;

					const clear_current_capture = () => {
						this.must_capture = false;
						this.in_capture_state = false;
						this.cursor_log.length = 0;
						this.selected_square.length = 0;
						this.clearCaptures();
						this.switchTurn();
						this.capture_allowed = true;
					};

					const moves = [];

					this.captures.forEach((capture) => {
						if (
							capture.start.toString() === first_capture.toString() &&
							capture.end.toString() !== [old_row, old_col].toString()
						) {
							moves.push(first_capture);
						}
					});
					if (moves.length !== 0) {
						this.in_capture_state = true;
						this.cursor_log = [[new_row, new_col]];
						this.selected_square = [new_row, new_col];
						this.active_capture_piece = capture_piece.piece
						this.capture_allowed = true;
					} else {
						clear_current_capture();
					}
				} else {
					if (this.in_capture_state && this.active_capture_piece) {
						this.cursor_log = [this.active_capture_piece.position];
						this.selected_square = this.active_capture_piece.position;
						this.capture_allowed = true;
					}
				}
			} else {
				if (this.in_capture_state && this.active_capture_piece) {
					this.cursor_log = [this.active_capture_piece.position];
					this.selected_square = this.active_capture_piece.position;
					this.capture_allowed = true;
				}
			}
		}
	}

	switchTurn() {
		this.current_player = this.current_player === "white" ? "black" : "white";
	}
}
