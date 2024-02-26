import type { AxiosProgressEvent } from 'axios';
import BaseApi from './base';
import type { UploadedFile } from './types';

export default class FileApi extends BaseApi {
	public async uploadFile(
		file: File,
		thumbnail: string,
		progressCallback?: (event: AxiosProgressEvent) => void
	): Promise<{ id: string }> {
		const formData = new FormData();

		formData.append('file', file);
		formData.append('thumbnail', thumbnail);
		const { data } = await this.axios.post('/files', formData, {
			onUploadProgress: progressCallback
		});
		return data;
	}

	public async list(): Promise<{ files: UploadedFile[] }> {
		return this.httpGet('/files/list');
	}
}
