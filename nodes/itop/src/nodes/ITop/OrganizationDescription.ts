import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an organization',
				action: 'Create an organization',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an organization',
				action: 'Delete an organization',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an organization',
				action: 'Get an organization',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many organizations',
				action: 'Get many organizations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an organization',
				action: 'Update an organization',
			},
		],
		default: 'create',
	},
];

export const organizationFields: INodeProperties[] = [
	// Organization ID field
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['delete', 'get', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the organization',
	},

	// Required fields for create operation
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The name of the organization',
	},

	// Fields for create and update operations
	{
		displayName: 'Organization Fields',
		name: 'organizationFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the organization (only for update operations)',
			},
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				default: '',
				description: 'The code/abbreviation of the organization',
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
				description: 'The status of the organization',
			},
			{
				displayName: 'Parent Organization',
				name: 'parent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listOrganizations',
				},
				default: '',
				description: 'The parent organization (for hierarchical organizations)',
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
				resource: ['organization'],
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
				resource: ['organization'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
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
				description: 'Filter organizations by status',
			},
			{
				displayName: 'Parent Organization',
				name: 'parent_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'listOrganizations',
				},
				default: '',
				description: 'Filter organizations by parent organization',
			},
		],
	},
];