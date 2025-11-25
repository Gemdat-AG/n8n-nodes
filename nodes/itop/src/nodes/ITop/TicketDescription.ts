import type { INodeProperties } from 'n8n-workflow';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a ticket',
				action: 'Create a ticket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a ticket',
				action: 'Delete a ticket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a ticket',
				action: 'Get a ticket',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many tickets',
				action: 'Get many tickets',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a ticket',
				action: 'Update a ticket',
			},
		],
		default: 'create',
	},
];

export const ticketFields: INodeProperties[] = [
	// Ticket ID field
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['delete', 'get', 'update'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the ticket',
	},

	// Fields for create and update operations
	{
		displayName: 'Ticket Fields',
		name: 'ticketFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'The title of the ticket',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The description of the ticket',
			},
			{
				displayName: 'Caller ID',
				name: 'caller_id',
				type: 'number',
				default: 0,
				description: 'The ID of the person who created the ticket',
			},
			{
				displayName: 'Impact',
				name: 'impact',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'low',
				description: 'The impact level of the ticket',
			},
			{
				displayName: 'Urgency',
				name: 'urgency',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'low',
				description: 'The urgency level of the ticket',
			},
			{
				displayName: 'Service ID',
				name: 'service_id',
				type: 'number',
				default: 0,
				description: 'The ID of the service related to the ticket',
			},
			{
				displayName: 'Team ID',
				name: 'team_id',
				type: 'number',
				default: 0,
				description: 'The ID of the team assigned to the ticket',
			},
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'number',
				default: 0,
				description: 'The ID of the agent assigned to the ticket',
			},
			{
				displayName: 'Status',
				name: 'operational_status',
				type: 'options',
				options: [
					{
						name: 'Ongoing',
						value: 'ongoing',
					},
					{
						name: 'Resolved',
						value: 'resolved',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: 'ongoing',
				description: 'The operational status of the ticket',
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
				resource: ['ticket'],
				operation: ['getAll'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'operational_status',
				type: 'options',
				options: [
					{
						name: 'Ongoing',
						value: 'ongoing',
					},
					{
						name: 'Resolved',
						value: 'resolved',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: '',
				description: 'Filter tickets by operational status',
			},
			{
				displayName: 'Caller ID',
				name: 'caller_id',
				type: 'number',
				default: 0,
				description: 'Filter tickets by caller ID',
			},
			{
				displayName: 'Team ID',
				name: 'team_id',
				type: 'number',
				default: 0,
				description: 'Filter tickets by team ID',
			},
			{
				displayName: 'Impact',
				name: 'impact',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: '',
				description: 'Filter tickets by impact level',
			},
			{
				displayName: 'Urgency',
				name: 'urgency',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Medium',
						value: 'medium',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: '',
				description: 'Filter tickets by urgency level',
			},
		],
	},
];