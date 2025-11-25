// iTop REST API Types
export interface ITopApiResponse<T = any> {
	version: string;
	code: number;
	message?: string;
	objects?: Record<string, ITopObject<T>>;
}

export interface ITopObject<T = any> {
	code: number;
	message: string;
	class: string;
	key: string | number;
	fields: T;
}

export interface ITopRequest {
	version: string;
	operation: string;
	class: string;
	key?: string | number;
	fields?: Record<string, any>;
	output_fields?: string;
}

import type { IDataObject } from 'n8n-workflow';

// Base iTop Entity
export interface BaseITopEntity extends IDataObject {
	id?: number;
	friendlyname?: string;
	obsolescence_flag?: boolean;
	obsolescence_date?: string | null;
}

// Ticket Entity
export interface Ticket extends BaseITopEntity {
	operational_status?: 'ongoing' | 'resolved' | 'closed';
	ref?: string;
	title?: string;
	description?: string;
	start_date?: string;
	end_date?: string | null;
	last_update?: string;
	close_date?: string | null;
	private_log?: string;
	caller_id?: number;
	caller_name?: string;
	team_id?: number;
	team_name?: string;
	agent_id?: number;
	agent_name?: string;
	related_request_id?: number;
	public_log?: string;
	user_satisfaction?: 'very_satisfied' | 'satisfied' | 'unsatisfied' | 'very_unsatisfied' | null;
	user_comment?: string;
	parent_incident_id?: number;
	impact?: 'low' | 'medium' | 'high';
	urgency?: 'low' | 'medium' | 'high';
	priority?: 'low' | 'medium' | 'high';
	workgroup_id?: number;
	workgroup_name?: string;
	resolution_code?: 'assistance' | 'bug fixed' | 'hardware repair' | 'other';
	solution?: string;
	pending_reason?: string;
	parent_incident_ref?: string;
	origin?: 'mail' | 'monitoring' | 'phone' | 'portal';
	service_id?: number;
	service_name?: string;
	servicesubcategory_id?: number;
	servicesubcategory_name?: string;
	escalation_flag?: boolean;
	escalation_deadline?: string | null;
	assignment_date?: string | null;
	resolution_date?: string | null;
	last_pending_date?: string | null;
	cumulatedtime?: string;
}

// Person Entity  
export interface Person extends BaseITopEntity {
	name?: string;
	first_name?: string;
	email?: string;
	login?: string;
	language?: string;
	status?: 'active' | 'inactive';
	org_id?: number;
	org_name?: string;
	manager_id?: number;
	manager_name?: string;
	function?: string;
	phone?: string;
	mobile_phone?: string;
	location_id?: number;
	location_name?: string;
	employee_number?: string;
}

// Organization Entity
export interface Organization extends BaseITopEntity {
	name?: string;
	code?: string;
	status?: 'active' | 'inactive';
	parent_id?: number;
	parent_name?: string;
	deliverymodel_id?: number;
	deliverymodel_name?: string;
}

// Parameter interfaces for API operations
export interface TicketParameters {
	title?: string;
	description?: string;
	caller_id?: number;
	impact?: string;
	urgency?: string;
	service_id?: number;
	workgroup_id?: number;
}

export interface PersonParameters {
	name?: string;
	first_name?: string;
	email?: string;
	login?: string;
	org_id?: number;
	phone?: string;
	mobile_phone?: string;
	function?: string;
	employee_number?: string;
	location_id?: number;
	manager_id?: number;
}

export interface OrganizationParameters {
	name?: string;
	code?: string;
	status?: string;
	parent_id?: number;
}

// Filter interfaces for list operations
export interface TicketFilters {
	operational_status?: string;
	caller_id?: number;
	team_id?: number;
	impact?: string;
	urgency?: string;
	priority?: string;
	service_id?: number;
	workgroup_id?: number;
	start_date_from?: string;
	start_date_to?: string;
}

export interface PersonFilters {
	org_id?: number;
	status?: string;
	manager_id?: number;
	location_id?: number;
}

export interface OrganizationFilters {
	status?: string;
	parent_id?: number;
}