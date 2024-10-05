<script lang="ts">
	import CheckersPiece from "./checkers-piece.svelte";
	import MovesIcon from "./moves-icon.svelte";

	import { game } from "$lib/stores/game";

	$: board = $game.board;

	$: if (!$game.game_over) {
		if ($game.capture_allowed) {
			$game.generateCaptures();
		}
		if (!$game.capture_allowed && $game.move_allowed && !$game.must_capture) {
			$game.generateMoves();
		}
	}

	function handleClick(row: number, col: number): void {
		game.update((game) => {
			game.updateCursorLog([row, col]);
			game.selectSquare();
			game.movePiece();
			game.capturePiece()
			return game;
		});
	}

	$: highlight = (row: number, col: number) => {
		const is_capture_square = $game.capture_positions.some(
			(capture) => capture[0] === row && capture[1] === col
		);
		if (is_capture_square && !$game.selected_square.length) {
			return "!border-blue-600 !border-2";
		}
		return "";
	};

	$: {
		console.log($game)
	}
</script>

<div class="border border-zinc-900" role="grid">
	{#each board as row, rowIndex}
		<div class="flex items-center">
			{#each row as piece, colIndex}
				<div
					class={`w-[55px] h-[55px] relative flex items-center border justify-center 
        ${rowIndex % 2 === colIndex % 2 ? "border-zinc-200 bg-zinc-200" : "border-zinc-900 bg-zinc-900"} ${highlight(rowIndex, colIndex)}`}
					role="none"
					on:click={() => handleClick(rowIndex, colIndex)}
				>
					<CheckersPiece {piece} />
					<MovesIcon {rowIndex} {colIndex} />
				</div>
			{/each}
		</div>
	{/each}
</div>
