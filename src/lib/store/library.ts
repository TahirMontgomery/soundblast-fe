import type { UploadedFile } from '$lib/api/types';
import { readonly, writable, type Readable } from 'svelte/store';

export interface StoreFile {
	file: UploadedFile;
	uri: string;
	loading: boolean;
	progress: number;
}

export interface LibraryActions {
	addFile: (file: StoreFile) => void;
	loadFiles: (file: StoreFile[]) => void;
	updateFileProgress: (id: string, progress: number, loaded: boolean) => void;
	setActive: (file: StoreFile) => void;
}

export interface LibraryState {
	files: Readable<StoreFile[]>;
	activeFile: Readable<StoreFile>;
}

const createLibrary = (): [LibraryState, LibraryActions] => {
	const files = writable<StoreFile[]>([]);
	const activeFile = writable<StoreFile>();

	const addFile = (file: StoreFile) => {
		files.update((prev) => [...prev, file]);
	};

	const loadFiles = (newFiles: StoreFile[]) => {
		files.set(newFiles);
	};

	const setActive = (file: StoreFile) => {
		if (file.loading) {
			return;
		}
		activeFile.set(file);
	};

	const updateFileProgress = (id: string, progress: number, loaded: boolean) => {
		files.update((prevFiles) => {
			const fs = [...prevFiles];
			const currentFileIdx = prevFiles.findIndex((f) => f.file.id === id);
			if (currentFileIdx >= 0) {
				fs[currentFileIdx].progress = progress;
				fs[currentFileIdx].loading = loaded;
			}

			return fs;
		});
	};

	const actions = {
		addFile,
		setActive,
		updateFileProgress,
		loadFiles
	};

	return [{ files: readonly(files), activeFile: readonly(activeFile) }, actions];
};

const library = createLibrary();
export default library;
