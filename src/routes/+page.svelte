<script>
	import AssetPane from '$lib/components/AssetPane.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import ToolPane from '$lib/components/ToolPane.svelte';
	import VideoPlayer from '$lib/components/VideoPlayer.svelte';
</script>

<div class="grid grid-cols-[1fr_2fr_1fr] gap-6">
	<AssetPane />
	<VideoPlayer />
	<ToolPane />
</div>

<div class="mt-6">
	<Timeline />
</div>
