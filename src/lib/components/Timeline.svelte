<script lang="ts">
	import rotateLeft from '$lib/assets/icons/rotate-left.svg';
	import rotateright from '$lib/assets/icons/rotate-right.svg';
	import trash from '$lib/assets/icons/trash.svg';
	import scissor from '$lib/assets/icons/scissor.svg';
	import crop from '$lib/assets/icons/crop.svg';

	const increments = new Array(30).fill(0).map((_, idx) => idx * 10);
	const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	let timeAxis: HTMLElement;
	// let trackWidth = 0;

	$: trackWidth = timeAxis?.scrollWidth ?? 0;

	function convertToDisplayTime(duration: number) {
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor((duration % 3600) / 60);
		const seconds = Math.floor(duration % 60);

		const formattedTime = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
		return formattedTime;
	}

	function pad(value: number) {
		return value.toString().padStart(2, '0');
	}

	function padMilliseconds(value: number) {
		return value.toString().padStart(3, '0');
	}
</script>

<div class="w-full bg-[#120C0D] rounded-xl overflow-hidden">
	<div class="p-5 flex items-center gap-7 border-b border-b-[#191919]">
		<button>
			<img alt="Rotate Left" src={rotateLeft} />
		</button>
		<button>
			<img alt="Rotate right" src={rotateright} />
		</button>
		<button>
			<img alt="Trash" src={trash} />
		</button>
		<button>
			<img alt="Cut video" src={scissor} />
		</button>
		<button>
			<img alt="Cro video" src={crop} />
		</button>
	</div>

	<div class="grid grid-cols-[1.25fr_8.75fr]">
		<!-- Track Tools -->
		<div class="w-full h-4"></div>

		<!-- Track Assets -->
		<div class="w-full overflow-x-auto pb-4 relative pl-4">
			<div bind:this={timeAxis} class="h-10 w-full flex items-center whitespace-nowrap">
				{#each increments as slot}
					<div class="flex items-center gap-2">
						<p class="text-white text-sm">{convertToDisplayTime(slot)}</p>

						<div class="flex gap-[10px] items-center mr-2">
							{#each ticks as tick}
								{#if tick === 5}
									<div class="w-[1px] h-4 bg-[#757575]"></div>
								{:else}
									<div class="w-[1px] h-2 bg-[#757575]"></div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- Actual Tracks -->
			<div style:width={`${trackWidth}px`} class="rounded-md w-full h-8 bg-[#151212] relative">
				<div class="h-8 bg-primary-300 w-20 left-12 absolute rounded-lg"></div>
				<div class="h-8 bg-primary-300 w-40 left-48 absolute rounded-lg"></div>
			</div>

			<div style:width={`${trackWidth}px`} class="rounded-md mt-2 w-full h-8 bg-[#151212] relative">
				<div class="h-8 bg-primary-300 w-20 left-12 absolute rounded-lg"></div>
				<div class="h-8 bg-primary-300 w-40 left-48 absolute rounded-lg"></div>
			</div>
		</div>
	</div>
</div>
