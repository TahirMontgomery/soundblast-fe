<script lang="ts">
	import VideoPlay from '$lib/assets/icons/VideoPlay.svg';
	import Music from '$lib/assets/icons/Music.svg';
	import Text from '$lib/assets/icons/Text.svg';
	import Plus from '$lib/assets/icons/Plus.svg';
	import Sort from '$lib/assets/icons/Sort.svg';
	import FilterSearch from '$lib/assets/icons/FilterSearch.svg';

	import libraryStore, { type StoreFile } from '$lib/store/library';
	import transcriptStore from '$lib/store/transcripts';

	import api from '$lib/api';
	import { onMount } from 'svelte';

	let inputElem: HTMLInputElement;

	const [{ files }, libraryActions] = libraryStore;
	const [, transcriptActions] = transcriptStore;

	onMount(async () => {
		await loadAllFiles();
	});

	const loadAllFiles = async () => {
		const { files: uploadedFiles } = await api.files.list();
		libraryActions.loadFiles(
			uploadedFiles.map((f) => ({
				file: f,
				uri: `http://localhost:8899/api/files/download/${f.id}`,
				loading: false,
				progress: 100
			}))
		);
	};

	const tabs = [
		{
			icon: VideoPlay,
			label: 'Media'
		},
		{
			icon: Music,
			label: 'Audio'
		},
		{
			icon: Text,
			label: 'Text'
		}
	];

	const handleImportFileClick = () => {
		if (!inputElem) return;

		inputElem.click();
	};

	const importFile = async (event: Event & { currentTarget: HTMLInputElement }) => {
		const inputFile = event.currentTarget.files![0];
		const { type, name, size } = inputFile;
		const file: StoreFile = {
			file: {
				id: String(Date.now()),
				filename: name,
				length: size,
				metadata: {
					content_type: type,
					thumbnail: ''
				}
			},
			uri: URL.createObjectURL(new Blob([inputFile], { type })),
			loading: true,
			progress: 0
		};

		const video = document.createElement('video');
		video.src = file.uri;

		const promise = new Promise<void>((res) => {
			video.addEventListener('loadeddata', async () => {
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d')!;

				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				// Convert canvas content to data URL
				const screenshotDataURL = canvas.toDataURL('image/png');
				file.file.metadata.thumbnail = screenshotDataURL;
				libraryActions.addFile(file);

				await api.files.uploadFile(inputFile, screenshotDataURL, (event) => {
					libraryActions.updateFileProgress(
						file.file.id!,
						event.progress! * 100,
						event.loaded !== event.total
					);
				});
				await loadAllFiles();
				res();
			});
		});

		video.load();
		video.currentTime = 1;
		await promise;
	};

	const setActiveFile = async (storeFile: StoreFile) => {
		libraryActions.setActive(storeFile);

		try {
			const { result } = await api.transcribe.transcribeFile(storeFile.file.id);
			transcriptActions.addTranscript(storeFile.file.id, result);
		} catch (error) {
			console.error(error);
		}
	};
</script>

<div class="w-full md:min-w-[484px] md:min-h-[435px] bg-[#120C0D] rounded-xl overflow-hidden">
	<div id="header" class="font-poppins flex gap-6 px-5 pt-5 border-b-2 pb-5 border-b-[#191919]">
		{#each tabs as tab}
			<div class="flex flex-col justify-center items-center">
				<img alt="ICON" src={tab.icon} />
				<p class=" text-white font-medium text-sm mt-1">{tab.label}</p>
			</div>
		{/each}
	</div>

	<div id="assets-pane-container" class="h-full flex overflow-hidden">
		<div
			id="assets-pane-sidebar"
			class="p-5 border-r-2 border-r-[#191919] max-w-[128px] max-h-full"
		>
			<ul>
				<li
					class="w-[88px] h-[28px] mb-3 bg-[#4D67EB] p-2 flex items-center justify-center rounded text-white"
				>
					Local
				</li>
			</ul>
		</div>
		<div id="assets-pane-content" class="p-3 w-full">
			<div id="assets-pane-content-header" class="flex justify-between">
				<div>
					<button
						on:click={handleImportFileClick}
						class="rounded flex items-center justify-center gap-2 text-sm text-white border-2 border-[#191919] px-2 py-1 cursor-pointer"
					>
						<img src={Plus} alt="" /> Import
					</button>
					<input
						class="hidden"
						type="file"
						name="Import File"
						id="importFile"
						bind:this={inputElem}
						on:change={importFile}
					/>
				</div>
				<div class="flex gap-2">
					<button
						class="rounded flex items-center justify-center gap-2 text-sm text-white border-2 border-[#191919] px-2 py-1 cursor-pointer min-w-[56px]"
					>
						<img src={Sort} alt="" /> Sort
					</button>
					<button
						class="rounded flex items-center justify-center gap-2 text-sm text-white border-2 border-[#191919] px-2 py-1 cursor-pointer min-w-[56px]"
					>
						<img src={FilterSearch} alt="" /> All
					</button>
				</div>
			</div>

			<div
				id="assets-pane-content-body"
				class="mt-5 grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pb-10 pr-2"
			>
				{#each $files as storeFile}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="w-full cursor-pointer"
						tabindex={0}
						role="button"
						on:click={() => setActiveFile(storeFile)}
					>
						<div class="w-full h-[60px] bg-white rounded relative">
							<img
								class="w-full h-full object-contain"
								src={storeFile.file.metadata.thumbnail}
								alt={storeFile.file.filename}
							/>
							{#if storeFile.loading}
								<div
									style:width={`${storeFile.progress}%`}
									class="rounded absolute h-[5px] bg-primary-100"
								></div>
							{/if}
						</div>
						<p class="mt-2 text-center text-[#757575] text-xs">{storeFile.file.filename}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
