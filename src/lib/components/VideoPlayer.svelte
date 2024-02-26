<script lang="ts">
	// @ts-expect-error
	import IoIosPlay from 'svelte-icons/io/IoIosPlay.svelte';
	// @ts-expect-error
	import IoIosSkipForward from 'svelte-icons/io/IoIosSkipForward.svelte';
	// @ts-expect-error
	import IoIosSkipBackward from 'svelte-icons/io/IoIosSkipBackward.svelte';
	// @ts-expect-error
	import IoIosVolumeLow from 'svelte-icons/io/IoIosVolumeLow.svelte';
	// @ts-expect-error
	import IoMdExpand from 'svelte-icons/io/IoMdExpand.svelte';
	// @ts-expect-error
	import IoIosPause from 'svelte-icons/io/IoIosPause.svelte';
	// your script goes here
	import videojs from 'video.js';
	import 'video.js/dist/video-js.css';

	import libraryStore, { type StoreFile } from '$lib/store/library';
	import type Player from 'video.js/dist/types/player';
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	const [{ activeFile }] = libraryStore;

	let videoElem: HTMLVideoElement;
	let progressElem: HTMLDivElement;
	let thumbElem: HTMLDivElement;
	let trackElem: HTMLDivElement;

	let showVolume = false;
	let player: Player;
	let ready = false;
	let metadata = {
		duration: 0,
		formatDuration: '00 : 00 : 00 : 00',
		currentTime: 0,
		formatCurrentTime: '00 : 00 : 00 : 00',
		paused: true,
		progress: 0,
		volume: 0.5
	};

	onMount(() => {
		const onDimensionChange = () => {
			trackProgress();
		};

		window.addEventListener('resize', onDimensionChange);

		return () => window.removeEventListener('resize', onDimensionChange);
	});

	const registerTrackEvents = (node: HTMLDivElement, isTrack: Boolean = true) => {
		node.addEventListener('click', (e) => {
			const newPos = e.offsetX / (isTrack ? node.clientWidth : trackElem.clientWidth);
			if (player && player.duration() && player.duration()! > 0) {
				const newTime = player.duration()! * newPos;
				player.currentTime(newTime);
				trackProgress();
			}
		});
	};

	const trackThumbMove = (e: MouseEvent) => {
		const newPos = e.clientX - trackElem.getBoundingClientRect().left;

		const trackWidth = trackElem.clientWidth;
		const newPosPercentage = Math.max(0, Math.min(1, newPos / trackWidth));
		const newTime = player.duration()! * newPosPercentage;
		player.currentTime(newTime);
		trackProgress();
	};

	const registerThumbEvents = (node: HTMLDivElement) => {
		node.addEventListener('mousedown', () => {
			document.addEventListener('mousemove', trackThumbMove);
		});

		node.addEventListener('mouseleave', (e) => {
			const { clientX, clientY } = e;
			const { left, top, bottom, right } = trackElem.getBoundingClientRect();
			if (clientX <= left || clientX >= right || clientY < top - 25 || clientY > bottom + 25) {
				document.removeEventListener('mousemove', trackThumbMove);
			}
		});

		node.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', trackThumbMove);
		});
	};

	const trackProgress = () => {
		metadata.currentTime = player.currentTime()!;
		metadata.formatCurrentTime = convertToDisplayTime(metadata.currentTime);

		if (metadata.duration > 0) {
			metadata.progress = (metadata.currentTime / metadata.duration) * 100;
			if (progressElem) {
				progressElem.style.width = `${metadata.progress}%`;
			}

			if (thumbElem && trackElem) {
				const thumbPos = trackElem.clientWidth * (metadata.progress / 100);
				thumbElem.style.left = `${thumbPos - thumbElem.clientWidth / 2}px`;
			}
		}

		if (!player.paused()) {
			requestAnimationFrame(trackProgress);
		}
	};

	$: {
		if (!player && videoElem) {
			player = videojs(videoElem, {
				autoplay: false
			});

			player.on('ready', () => {
				ready = player.isReady_;
			});

			player.on('play', () => {
				metadata.paused = false;
				trackProgress();
			});
			player.on('pause', () => {
				metadata.paused = true;
			});
			player.on('fullscreenchange', () => {
				player.controls(player.isFullscreen());
			});
			player.on('loadedmetadata', () => {
				metadata.duration = player.duration()!;
				metadata.formatDuration = convertToDisplayTime(metadata.duration);
			});
		}
	}

	$: {
		if ($activeFile) {
			const sourceObj = { src: $activeFile.uri, type: $activeFile.file.metadata.content_type };
			player?.src?.(sourceObj);
		}
	}

	function convertToDisplayTime(duration: number) {
		const hours = Math.floor(duration / 3600);
		const minutes = Math.floor((duration % 3600) / 60);
		const seconds = Math.floor(duration % 60);
		const milliseconds = Math.round((duration % 1) * 1000);

		const formattedTime = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)} : ${padMilliseconds(milliseconds)}`;
		return formattedTime;
	}

	function pad(value: number) {
		return value.toString().padStart(2, '0');
	}

	function padMilliseconds(value: number) {
		return value.toString().padStart(3, '0');
	}

	const play = async () => {
		return player.play();
	};

	const pause = async () => {
		return player.pause();
	};

	const toggleFullScreen = () => {
		player.controls(true);
		return player.requestFullscreen();
	};

	function toggleVolume() {
		showVolume = !showVolume;
	}

	function modifyVolume(event: Event & { currentTarget: HTMLInputElement }) {
		metadata.volume = Number(event.currentTarget.value);
		player.volume(metadata.volume);
	}
</script>

<div class="md:min-w-[500px] w-full md:min-h-[435px] h-fit bg-[#120C0D] rounded-xl">
	<!-- Video -->
	<div class="h-[400px] w-full">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class="video-js vjs-fill" bind:this={videoElem} />
	</div>
	<div class="p-5">
		<!-- Timeline -->
		<div class="w-full mt-2 flex gap-5 items-center">
			<div class="relative w-full" id="timeline-slider">
				<div
					use:registerTrackEvents
					bind:this={trackElem}
					class="rounded w-full bg-[#191919] h-[8px] cursor-pointer"
					id="track"
				></div>
				<div
					use:registerTrackEvents={false}
					bind:this={progressElem}
					class="cursor-pointer rounded-l bg-[#4D67EB] h-[8px] absolute top-1/2 -translate-y-1/2"
					id="progress"
				></div>
				<div
					use:registerThumbEvents
					bind:this={thumbElem}
					class="w-4 h-4 rounded-full bg-[#D9D9D9] absolute top-1/2 -translate-y-1/2 cursor-pointer"
					id="thumb"
					role="button"
					tabindex="0"
				></div>
			</div>
		</div>

		<!-- Divider -->
		<div class="h-[1px] w-full bg-[#191919] mt-4"></div>

		<!-- Controls -->
		<div class="mt-4 flex justify-between">
			<div class="flex items-center gap-3">
				<div class="w-6 h-6 text-white">
					<IoIosSkipBackward />
				</div>
				{#if metadata.paused}
					<button
						on:click={play}
						disabled={!$activeFile || !ready}
						class="w-6 h-6 text-white disabled:opacity-50"
					>
						<IoIosPlay />
					</button>
				{:else}
					<button
						on:click={pause}
						disabled={!$activeFile}
						class="w-6 h-6 text-white disabled:opacity-50"
					>
						<IoIosPause />
					</button>
				{/if}
				<div class="w-6 h-6 text-white">
					<IoIosSkipForward />
				</div>
			</div>
			<div class="flex justify-end items-center gap-2">
				<div class="border border-[#191919] py-1 px-2 rounded" id="timeline-time">
					<p class="text-white whitespace-nowrap text-base">{metadata.formatCurrentTime}</p>
				</div>
				<p class="text-white">-</p>
				<div class="border border-[#191919] py-1 px-2 rounded" id="timeline-time">
					<p class="text-white whitespace-nowrap text-base">{metadata.formatDuration}</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<div class="relative flex justify-center items-center">
					{#if showVolume}
						<div
							transition:fade={{ duration: 100 }}
							class="absolute transition-all bottom-[270%] rotate-[270deg] left-1/2 -translate-x-1/2 whitespace-nowrap"
						>
							<input
								step={0.1}
								on:change={modifyVolume}
								max={1}
								value={metadata.volume}
								type="range"
								name="volume"
								id="volume"
							/>
						</div>
					{/if}

					<button on:click={toggleVolume} class="w-8 h-8 text-white cursor-pointer">
						<IoIosVolumeLow />
					</button>
				</div>

				<button on:click={toggleFullScreen} class="w-6 h-6 text-white">
					<IoMdExpand />
				</button>
			</div>
		</div>
	</div>
</div>
