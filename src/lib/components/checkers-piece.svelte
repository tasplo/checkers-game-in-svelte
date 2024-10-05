<script lang="ts">
	import white_king from "../../assets/svg/white_king.svg";
	import white_king_selected from "../../assets/svg/white_king_selected.svg";
	import white_pawn from "../../assets/svg/white_pawn.svg";
	import white_pawn_selected from "../../assets/svg/white_pawn_selected.svg";
	import black_king from "../../assets/svg/black_king.svg";
	import black_king_selected from "../../assets/svg/black_king_selected.svg";
	import black_pawn from "../../assets/svg/black_pawn.svg";
	import black_pawn_selected from "../../assets/svg/black_pawn_selected.svg";

	import type { Piece } from "$lib/models/piece";
	import { game } from "$lib/stores/game";

	export let piece: Piece | null;

	$: selected = $game.selected_square;
</script>

{#if piece}
	{#if piece.color === "white"}
		{#if selected.toString() === piece.position.toString()}
			<img
				src={piece.is_king ? white_king_selected : white_pawn_selected}
				alt={piece.color}
				class={`h-auto w-[calc(0.85*55px)]`}
			/>
		{:else}
			<img
				src={piece.is_king ? white_king : white_pawn}
				alt={piece.color}
				class={`h-auto w-[calc(0.85*55px)]`}
			/>
		{/if}
	{:else if selected.toString() === piece.position.toString()}
		<img
			src={piece.is_king ? black_king_selected : black_pawn_selected}
			alt={piece.color}
			class={`h-auto w-[calc(0.85*55px)]`}
		/>
	{:else}
		<img
			src={piece.is_king ? black_king : black_pawn}
			alt={piece.color}
			class={`h-auto w-[calc(0.85*55px)]`}
		/>
	{/if}
{/if}
