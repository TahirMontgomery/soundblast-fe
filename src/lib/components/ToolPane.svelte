<script lang="ts">
	import type { WhisperResult } from '$lib/api/types';
	import libraryStore from '$lib/store/library';
	import transcriptStore from '$lib/store/transcripts';
	import { Timeline, TimelineItem } from 'flowbite-svelte';

	const [{ activeFile }] = libraryStore;
	const [transcriptMap] = transcriptStore;

	let generatingTranscript = false;
	let activeTranscript: WhisperResult | undefined;

	$: {
		if ($activeFile && ($activeFile.loading || !$transcriptMap.has($activeFile.file.id))) {
			generatingTranscript = true;
		} else {
			generatingTranscript = false;
		}

		if ($activeFile) {
			activeTranscript = $transcriptMap.get($activeFile.file.id);
		}
	}
</script>

<div class="w-full md:min-w-[484px] md:min-h-[435px] bg-[#120C0D] rounded-xl overflow-hidden">
	<div class="flex border-b border-b-[#191919] p-5 text-white">
		<p>Transcript</p>
	</div>

	{#if generatingTranscript}
		<div class="flex justify-center items-center pt-8">
			<p class="text-white">Generating Transcript...</p>
		</div>
	{:else if activeTranscript}
		<div class="p-4 max-h-[435px] overflow-y-auto">
			<Timeline>
				{#each activeTranscript.segments as segment}
					<TimelineItem date={String(segment.start)}>
						<p class="text-white">{segment.text}</p>
					</TimelineItem>
					<!-- content here -->
				{/each}
			</Timeline>
		</div>
	{/if}
</div>
