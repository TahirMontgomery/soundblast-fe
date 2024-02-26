export interface UploadedFile {
	id: string;
	length: number;
	filename: string;
	metadata: {
		content_type: string;
		thumbnail: string;
	};
}

export interface WhisperResultWord {
	start: number;
	end: number;
	text: string;
	confidence: number;
}

export interface WhisperResultSegment {
	id: number;
	seek: number;
	start: number;
	end: number;
	text: string;
	tokens: number[];
	confidence: number;
	words: WhisperResultWord[];
}

export interface WhisperResult {
	text: string;
	segments: WhisperResultSegment[];
}
