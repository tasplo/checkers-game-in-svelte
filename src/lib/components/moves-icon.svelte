<script lang="ts">
	import move_piece from "../../assets/svg/move_piece.svg";

	import { game } from "$lib/stores/game";

	export let rowIndex;
	export let colIndex;

	$: selected = $game.selected_square;
	$: moves = $game.moves;
	$: captures = $game.captures;
	$: must_capture = $game.must_capture;

	let captureMoves: number[][] = [];

	$: if (must_capture && selected.length) {
		captureMoves.length = 0 

		const is_capture_piece = captures.find(
			(capture) => capture.start.toString() === selected.toString()
		);

		if (is_capture_piece) {
			captures.forEach((capture) => {
				if (capture.start.toString() === selected.toString()) {
					addUniqueMove(capture.end);
				}
			});

			const findChainedCaptures = (moves: number[][]) => {
				let newMoves: number[][] = [];

				moves.forEach((move) => {
					captures.forEach((capture) => {
						if (capture.start.toString() === move.toString()) {
							addUniqueMove(capture.end);
							newMoves.push(capture.end); 
						}
					});
				});

				if (newMoves.length > 0) {
					findChainedCaptures(newMoves);
				}
			};

			findChainedCaptures(captureMoves);
		}
	}

	function addUniqueMove(move: number[]) {
		if (!captureMoves.some((m) => m.toString() === move.toString())) {
			captureMoves.push(move);
		}
	}
</script>

{#if selected.length && !must_capture}
	{#each moves as move}
		{#if move.start.toString() === selected.toString()}
			{#if move.end.toString() === [rowIndex, colIndex].toString()}
				<img src={move_piece} alt="move icon" class="w-auto h-[12px]" />
			{/if}
		{/if}
	{/each}
{/if}
{#each captureMoves as captureMove}
	{#if captureMove.toString() === [rowIndex, colIndex].toString()}
		{#if selected.toString() !== [rowIndex, colIndex].toString()}
			<img src={move_piece} alt="move icon" class="w-auto h-[12px]" />
		{/if}
	{/if}
{/each}
