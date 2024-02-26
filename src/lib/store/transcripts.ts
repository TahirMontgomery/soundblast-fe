import type { WhisperResult } from '$lib/api/types';
import { readonly, writable, type Readable } from 'svelte/store';

export interface LibraryActions {
	addTranscript: (id: string, tx: WhisperResult) => void;
}

export type LibraryState = Readable<Map<string, WhisperResult>>;

const createTranscriptStore = (): [LibraryState, LibraryActions] => {
	const transcriptMap = writable<Map<string, WhisperResult>>(new Map());

	const addTranscript = (id: string, tx: WhisperResult) => {
		transcriptMap.update((prev) => {
			prev.set(id, tx);
			return prev;
		});
	};

	const actions = {
		addTranscript
	};

	return [readonly(transcriptMap), actions];
};

const map = createTranscriptStore();
export default map;
