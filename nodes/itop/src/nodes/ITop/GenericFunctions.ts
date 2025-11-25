import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
	NodeParameterValue,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { ITopApiResponse, ITopRequest } from '../../api';

export async function iTopApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	operation: string,
	className: string,
	key?: string | number,
	fields?: IDataObject,
	outputFields: string = '*',
): Promise<ITopApiResponse> {
	const credentials = await this.getCredentials('iTopApi');

	const body: ITopRequest = {
		version: '1.3',
		operation,
		class: className,
	};

	if (key !== undefined) {
		body.key = key;
	}

	if (fields) {
		body.fields = fields;
	}

	if (outputFields && outputFields !== '*') {
		body.output_fields = outputFields;
	}

	// Prepare the JSON data object
	const jsonData: IDataObject = {
		operation: body.operation,
		class: body.class,
	};

	// Add optional comment for audit trail
	if (body.operation === 'core/create' || body.operation === 'core/update' || body.operation === 'core/delete') {
		jsonData.comment = `n8n automation - ${body.operation} ${body.class}`;
	}

	if (body.key !== undefined) {
		jsonData.key = body.key;
	}

	if (body.fields) {
		jsonData.fields = body.fields;
	}

	if (body.output_fields && body.output_fields !== '*') {
		jsonData.output_fields = body.output_fields;
	}

	const options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		form: {
			auth_user: credentials.username,
			auth_pwd: credentials.password,
			json_data: JSON.stringify(jsonData),
		},
		uri: `${credentials.url}/webservices/rest.php?version=${body.version}`,
		json: true,
	};

	try {
		const response = await this.helpers.request(options);
		
		if (response.code !== 0) {
			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: response.message || 'Unknown iTop API error',
				httpCode: '400',
			});
		}

		return response;
	} catch (error) {
		if (error.cause?.code === 'ECONNREFUSED') {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Connection refused. Please check your iTop URL and ensure the server is running.',
			});
		}
		throw error;
	}
}

export async function iTopApiRequestAllItems<T>(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	className: string,
	oqlQuery: string,
	outputFields: string = '*',
): Promise<T[]> {
	const returnData: T[] = [];

	const response = await iTopApiRequest.call(
		this,
		'core/get',
		className,
		oqlQuery,
		undefined,
		outputFields
	);

	if (response.objects) {
		for (const objectKey of Object.keys(response.objects)) {
			const object = response.objects[objectKey];
			if (object.code === 0) {
				// Use the key field as the ID (e.g., "145")
				const id = object.key;
				
				// Combine the ID first, then the fields
				const result = {
					id: parseInt(id.toString(), 10),
					...object.fields,
				} as T;
				
				returnData.push(result);
			}
		}
	}

	return returnData;
}

export function createParametersFromNodeParameter(
	this: IExecuteFunctions,
	nodeParameter: IDataObject,
): IDataObject {
	const parameters: IDataObject = {};

	for (const [key, value] of Object.entries(nodeParameter)) {
		if (value !== undefined && value !== null && value !== '') {
			parameters[key] = value;
		}
	}

	return parameters;
}

export function extractObjectFromResponse<T>(response: ITopApiResponse<T>): T {
	if (!response.objects) {
		throw new Error('No objects returned from iTop API');
	}

	const objectKeys = Object.keys(response.objects);
	if (objectKeys.length === 0) {
		throw new Error('No objects found in response');
	}

	const firstObjectKey = objectKeys[0];
	const firstObject = response.objects[firstObjectKey];
	if (firstObject.code !== 0) {
		throw new Error(`iTop API error: ${firstObject.message}`);
	}

	// Use the key field as the ID (e.g., "145")
	const id = firstObject.key;
	
	// Combine the ID first, then the fields
	const result = {
		id: parseInt(id.toString(), 10),
		...firstObject.fields,
	} as T;

	return result;
}