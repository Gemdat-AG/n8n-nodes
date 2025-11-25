import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a person',
				action: 'Create a person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
				action: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a person',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many persons',
				action: 'Get many persons',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
			},
		],
		default: 'create',
	},
];

export const personFields: INodeProperties[] = [
	// Person ID field
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['delete', 'get', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the person',
	},

	// Required fields for create operation
	{
		displayName: 'Name (Last Name)',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The last name of the person',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The first name of the person',
	},
	{
		displayName: 'Organization',
		name: 'org_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'listOrganizations',
		},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The organization this person belongs to',
	},

	// Fields for create and update operations
	{
		displayName: 'Person Fields',
		name: 'personFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Name (Last Name)',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The last name of the person (only for update operations)',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'The first name of the person (only for update operations)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'The email address of the person',
			},
			{
				displayName: 'Login',
				name: 'login',
				type: 'string',
				default: '',
				description: 'The login username of the person',
			},
			{
				displayName: 'Organization',
				name: 'org_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listOrganizations',
				},
				default: '',
				description: 'The organization this person belongs to (only for update operations)',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'The phone number of the person',
			},
			{
				displayName: 'Mobile Phone',
				name: 'mobile_phone',
				type: 'string',
				default: '',
				description: 'The mobile phone number of the person',
			},
			{
				displayName: 'Function',
				name: 'function',
				type: 'string',
				default: '',
				description: 'The function/job title of the person',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
				],
				default: 'active',
				description: 'The status of the person',
			},
			{
				displayName: 'Employee Number',
				name: 'employee_number',
				type: 'string',
				default: '',
				description: 'The employee number of the person',
			},
			{
				displayName: 'Location',
				name: 'location_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listLocations',
				},
				default: '',
				description: 'The location of the person',
			},
			{
				displayName: 'Manager',
				name: 'manager_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listPersons',
				},
				default: '',
				description: 'The manager of this person',
			},
			{
				displayName: 'Notify',
				name: 'notify',
				type: 'options',
				options: [
					{
						name: 'Yes',
						value: 'yes',
					},
					{
						name: 'No',
						value: 'no',
					},
				],
				default: 'yes',
				description: 'Whether to send notifications to this person',
			},
		],
	},

	// Custom fields for create and update operations
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		placeholder: 'Add Custom Field',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'customField',
				displayName: 'Custom Field',
				values: [
					{
						displayName: 'Field ID',
						name: 'fieldId',
						type: 'string',
						default: '',
						placeholder: 'ext_field_name',
						description: 'The ID of the custom field (e.g., ext_field_name)',
						required: true,
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description: 'The value for the custom field',
						required: true,
					},
				],
			},
		],
	},

	// Additional fields for getAll operation
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Organization',
				name: 'org_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listOrganizations',
				},
				default: '',
				description: 'Filter persons by organization',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Inactive',
						value: 'inactive',
					},
				],
				default: '',
				description: 'Filter persons by status',
			},
			{
				displayName: 'Manager',
				name: 'manager_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listPersons',
				},
				default: '',
				description: 'Filter persons by manager',
			},
			{
				displayName: 'Location',
				name: 'location_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listLocations',
				},
				default: '',
				description: 'Filter persons by location',
			},
			{
				displayName: 'Include Related Objects',
				name: 'includeRelated',
				type: 'boolean',
				default: false,
				description: 'Whether to include related tickets and CIs (may result in large responses)',
			},
			{
				displayName: 'Custom Output Fields',
				name: 'outputFields',
				type: 'string',
				displayOptions: {
					show: {
						includeRelated: [true],
					},
				},
				default: '',
				placeholder: 'id,name,first_name,email,tickets_list,cis_list',
				description: 'Comma-separated list of specific fields to include (leave empty for all fields)',
			},
		],
	},

	// Output Fields for get operation
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Related Objects',
				name: 'includeRelated',
				type: 'boolean',
				default: false,
				description: 'Whether to include related tickets and CIs (may result in large responses)',
			},
			{
				displayName: 'Custom Output Fields',
				name: 'outputFields',
				type: 'string',
				displayOptions: {
					show: {
						includeRelated: [true],
					},
				},
				default: '',
				placeholder: 'id,name,first_name,email,tickets_list,cis_list',
				description: 'Comma-separated list of specific fields to include (leave empty for all fields)',
			},
		],
	},
];