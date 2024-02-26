import axios from 'axios';
import FileApi from './files';
import TranscriptionApi from './transcription';

class Api {
	public files: FileApi;
	public transcribe: TranscriptionApi;

	constructor() {
		const _axios = axios.create({
			baseURL: 'http://localhost:8899/api',
			withCredentials: true
		});

		this.files = new FileApi(_axios);
		this.transcribe = new TranscriptionApi(_axios);
	}
}

const api = new Api();

export default api;
