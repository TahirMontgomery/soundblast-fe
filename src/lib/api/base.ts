import { Axios, AxiosError, type AxiosRequestConfig, HttpStatusCode } from 'axios';

export default class BaseApi {
	constructor(protected axios: Axios) {}

	protected async httpPost<T = unknown>(
		url: string,
		data?: unknown,
		config?: AxiosRequestConfig<unknown>
	): Promise<T> {
		try {
			const { data: responseData } = await this.axios.post(url, data, config);
			return responseData;
		} catch (error) {
			throw this.handleRequestError(error);
		}
	}

	protected async httpGet<T = unknown>(
		url: string,
		config?: AxiosRequestConfig<unknown>
	): Promise<T> {
		try {
			const { data: responseData } = await this.axios.get(url, config);
			return responseData;
		} catch (error) {
			throw this.handleRequestError(error);
		}
	}

	protected handleRequestError(error: unknown) {
		const err = error as AxiosError;
		const { response } = err;

		if (!response) {
			return new Error('Error occurred during request. Please try again');
		}

		const { data, status } = response;
		if (status === HttpStatusCode.Unauthorized || status === HttpStatusCode.Forbidden) {
			window.location.href = '/';
			return;
		}

		if (data) {
			const { error } = data as Record<string, unknown>;
			return new Error(error as string);
		}

		return new Error('Error occurred during request. Please try again');
	}
}
