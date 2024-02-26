import BaseApi from './base';
import type { WhisperResult } from './types';

export default class TranscriptionApi extends BaseApi {
	public async transcribeFile(id: string): Promise<{ result: WhisperResult }> {
		return this.httpPost('/transcribe', {
			id
		});
	}
}
