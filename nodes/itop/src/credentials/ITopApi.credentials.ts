import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ITopApi implements ICredentialType {
	name = 'iTopApi';

	displayName = 'iTop API';

	documentationUrl = 'https://docs.n8n.io/integrations/builtin/credentials/itop/';

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			placeholder: 'https://itop.example.com',
			default: '',
			required: true,
			description: 'The URL of your iTop instance',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'The username for authentication',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The password for authentication',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}',
			url: '/webservices/rest.php?version=1.3',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: 'auth_user={{$credentials.username}}&auth_pwd={{$credentials.password}}&json_data=' + encodeURIComponent(JSON.stringify({
				operation: 'list_operations',
			})),
		},
	};
}