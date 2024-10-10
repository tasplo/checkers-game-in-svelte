<script lang="ts">
	import move_piece from "../../assets/svg/move_piece.svg";

	import { game } from "$lib/stores/game";

	export let rowIndex;
	export let colIndex;

	$: selected = $game.selected_square;
	$: moves = $game.moves;
	$: must_capture = $game.must_capture;
	$: captureMoves = $game.captureMoves;
</script>

{#if selected.length}
	{#if !must_capture}
		{#each moves as move}
			{#if move.start.toString() === selected.toString()}
				{#if move.end.toString() === [rowIndex, colIndex].toString()}
					<img src={move_piece} alt="move icon" class="w-auto h-[12px]" />
				{/if}
			{/if}
		{/each}
	{:else}
		{#each captureMoves as captureMove}
			{#if captureMove.toString() === [rowIndex, colIndex].toString()}
				{#if selected.toString() !== [rowIndex, colIndex].toString()}
					<img src={move_piece} alt="move icon" class="w-auto h-[12px]" />
				{/if}
			{/if}
		{/each}
	{/if}
{/if}
