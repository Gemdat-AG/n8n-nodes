import {
  NodeConnectionTypes,
  type IDataObject,
  type IExecuteFunctions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
  type INodePropertyOptions,
  type INodeType,
  type INodeTypeDescription,
  type NodeApiError,
  type NodeParameterValue,
} from 'n8n-workflow';
import type {
  Ticket,
  TicketParameters,
  TicketFilters,
  Person,
  PersonParameters,
  PersonFilters,
  Organization,
  OrganizationParameters,
  OrganizationFilters,
  ITopApiResponse,
  ITopObject,
} from '../../api';
import {
  iTopApiRequest,
  iTopApiRequestAllItems,
  createParametersFromNodeParameter,
  extractObjectFromResponse,
} from './GenericFunctions';
import { ticketFields, ticketOperations } from './TicketDescription';
import { personFields, personOperations } from './PersonDescription';
import { organizationFields, organizationOperations } from './OrganizationDescription';

export class ITop implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'iTop',
    name: 'iTop',
    icon: 'file:itop.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume iTop API',
    defaults: {
      name: 'iTop',
    },
    inputs: [NodeConnectionTypes.Main],
    outputs: [NodeConnectionTypes.Main],
    credentials: [
      {
        name: 'iTopApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Organization',
            value: 'organization',
          },
          {
            name: 'Person',
            value: 'person',
          },
          {
            name: 'Ticket',
            value: 'ticket',
          },
        ],
        default: 'ticket',
      },
      ...organizationOperations,
      ...organizationFields,
      ...personOperations,
      ...personFields,
      ...ticketOperations,
      ...ticketFields,
    ],
  };

  methods = {
    loadOptions: {
      async listOrganizations(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        
        try {
          // Check if credentials are available
          await this.getCredentials('iTopApi');
        } catch (error) {
          // Return empty array if no credentials are set
          return returnData;
        }

        const organizations: Organization[] = await iTopApiRequestAllItems.call(
          this,
          'Organization',
          'SELECT Organization WHERE status = "active"',
          'id,name'
        );

        for (const organization of organizations) {
          returnData.push({
            name: organization.name || `Organization ${organization.id}`,
            value: organization.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },

      async listPersons(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];
        
        try {
          // Check if credentials are available
          await this.getCredentials('iTopApi');
        } catch (error) {
          // Return empty array if no credentials are set
          return returnData;
        }

        const persons: Person[] = await iTopApiRequestAllItems.call(
          this,
          'Person',
          'SELECT Person WHERE status = "active"',
          'id,name,first_name,email'
        );

        for (const person of persons) {
          const displayName = person.first_name && person.name 
            ? `${person.first_name} ${person.name}` 
            : person.name || `Person ${person.id}`;
          returnData.push({
            name: displayName,
            value: person.id,
          });
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },

      async listTeams(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        try {
          // Check if credentials are available
          await this.getCredentials('iTopApi');
        } catch (error) {
          // Return empty array if no credentials are set
          return returnData;
        }

        try {
          const teams = await iTopApiRequestAllItems.call(
            this,
            'Team',
            'SELECT Team',
            'id,name'
          );

          for (const team of teams) {
            returnData.push({
              name: team.name || `Team ${team.id}`,
              value: team.id,
            });
          }
        } catch (error) {
          // Teams might not be available in all iTop configurations
          console.warn('Teams not available:', error);
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },

      async listLocations(
        this: ILoadOptionsFunctions,
      ): Promise<INodePropertyOptions[]> {
        const returnData: INodePropertyOptions[] = [];

        try {
          // Check if credentials are available
          await this.getCredentials('iTopApi');
        } catch (error) {
          // Return empty array if no credentials are set
          return returnData;
        }

        try {
          const locations = await iTopApiRequestAllItems.call(
            this,
            'Location',
            'SELECT Location WHERE status = "active"',
            'id,name'
          );

          for (const location of locations) {
            returnData.push({
              name: location.name || `Location ${location.id}`,
              value: location.id,
            });
          }
        } catch (error) {
          // Locations might not be available in all iTop configurations
          console.warn('Locations not available:', error);
        }

        return returnData.sort((a, b) => a.name.localeCompare(b.name));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0);
    const operation = this.getNodeParameter('operation', 0);

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        if (resource === 'ticket') {
          // Ticket operations
          if (operation === 'create') {
            const fields = createParametersFromNodeParameter.call(
              this,
              this.getNodeParameter('ticketFields', i, {}) as IDataObject,
            ) as TicketParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/create',
              'UserRequest',
              undefined,
              fields
            );

            responseData = extractObjectFromResponse<Ticket>(response);
          } else if (operation === 'get') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;

            const response = await iTopApiRequest.call(
              this,
              'core/get',
              'UserRequest',
              ticketId,
              undefined,
              '*'
            );

            responseData = extractObjectFromResponse<Ticket>(response);
          } else if (operation === 'update') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;
            const fields = createParametersFromNodeParameter.call(
              this,
              this.getNodeParameter('ticketFields', i, {}) as IDataObject,
            ) as TicketParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/update',
              'UserRequest',
              ticketId,
              fields
            );

            responseData = extractObjectFromResponse<Ticket>(response);
          } else if (operation === 'delete') {
            const ticketId = this.getNodeParameter('ticketId', i) as string;

            await iTopApiRequest.call(
              this,
              'core/delete',
              'UserRequest',
              ticketId
            );

            responseData = { success: true, id: ticketId };
          }
          
          if (operation === 'getAll') {
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
            let oqlQuery = 'SELECT UserRequest';
            
            const conditions: string[] = [];
            if (additionalFields.operational_status) {
              conditions.push(`operational_status = '${additionalFields.operational_status}'`);
            }
            if (additionalFields.caller_id) {
              conditions.push(`caller_id = ${additionalFields.caller_id}`);
            }
            if (additionalFields.team_id) {
              conditions.push(`team_id = ${additionalFields.team_id}`);
            }

            if (conditions.length > 0) {
              oqlQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            responseData = await iTopApiRequestAllItems.call(
              this,
              'UserRequest',
              oqlQuery,
              '*'
            );
          }
        }

        if (resource === 'person') {
          // Person operations
          if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const first_name = this.getNodeParameter('first_name', i) as string;
            const org_id = this.getNodeParameter('org_id', i) as string;
            const additionalFields = this.getNodeParameter('personFields', i, {}) as IDataObject;
            const customFields = this.getNodeParameter('customFields', i, {}) as IDataObject;
            
            // Process custom fields
            const processedCustomFields: IDataObject = {};
            if (customFields.customField && Array.isArray(customFields.customField)) {
              for (const field of customFields.customField as Array<{fieldId: string, fieldValue: string}>) {
                if (field.fieldId && field.fieldValue) {
                  processedCustomFields[field.fieldId] = field.fieldValue;
                }
              }
            }
            
            const fields = createParametersFromNodeParameter.call(
              this,
              { name, first_name, org_id, ...additionalFields, ...processedCustomFields },
            ) as PersonParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/create',
              'Person',
              undefined,
              fields
            );

            responseData = extractObjectFromResponse<Person>(response);
          }

			if (operation === 'get') {
				const personId = this.getNodeParameter('personId', i) as string;
				const options = this.getNodeParameter('options', i, {}) as IDataObject;

				// Define basic person fields (excluding large related objects)
				const basicFields = 'id,name,first_name,email,status,org_id,org_name,manager_id,manager_name,function,phone,mobile_phone,location_id,location_name,employee_number,friendlyname,notify,location_id_friendlyname,obsolescence_flag,obsolescence_date';
				
				let outputFields = basicFields;
				if (options.includeRelated) {
					if (options.outputFields) {
						outputFields = options.outputFields as string;
					} else {
						outputFields = '*';
					}
				}

				const response = await iTopApiRequest.call(
					this,
					'core/get',
					'Person',
					personId,
					undefined,
					outputFields
				);

				responseData = extractObjectFromResponse<Person>(response);
			}          if (operation === 'update') {
            const personId = this.getNodeParameter('personId', i) as string;
            const additionalFields = this.getNodeParameter('personFields', i, {}) as IDataObject;
            const customFields = this.getNodeParameter('customFields', i, {}) as IDataObject;
            
            // Process custom fields
            const processedCustomFields: IDataObject = {};
            if (customFields.customField && Array.isArray(customFields.customField)) {
              for (const field of customFields.customField as Array<{fieldId: string, fieldValue: string}>) {
                if (field.fieldId && field.fieldValue) {
                  processedCustomFields[field.fieldId] = field.fieldValue;
                }
              }
            }
            
            const fields = createParametersFromNodeParameter.call(
              this,
              { ...additionalFields, ...processedCustomFields },
            ) as PersonParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/update',
              'Person',
              personId,
              fields
            );

            responseData = extractObjectFromResponse<Person>(response);
          }

			if (operation === 'delete') {
				const personId = this.getNodeParameter('personId', i) as string;

				await iTopApiRequest.call(
					this,
					'core/delete',
					'Person',
					personId,
					{} // Empty fields object, comment will be added automatically
				);

				responseData = { success: true, id: personId };
			}

          if (operation === 'getAll') {
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
            let oqlQuery = 'SELECT Person';
            
            const conditions: string[] = [];
            if (additionalFields.org_id) {
              conditions.push(`org_id = ${additionalFields.org_id}`);
            }
            if (additionalFields.status) {
              conditions.push(`status = '${additionalFields.status}'`);
            }

            if (conditions.length > 0) {
              oqlQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            // Define basic person fields (excluding large related objects)
            const basicFields = 'id,name,first_name,email,status,org_id,org_name,manager_id,manager_name,function,phone,mobile_phone,location_id,location_name,employee_number,friendlyname,notify,location_id_friendlyname,obsolescence_flag,obsolescence_date';
            
            let outputFields = basicFields;
            if (additionalFields.includeRelated) {
              if (additionalFields.outputFields) {
                outputFields = additionalFields.outputFields as string;
              } else {
                outputFields = '*';
              }
            }

            responseData = await iTopApiRequestAllItems.call(
              this,
              'Person',
              oqlQuery,
              outputFields
            );
          }
        }

        if (resource === 'organization') {
          // Organization operations
          if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const additionalFields = this.getNodeParameter('organizationFields', i, {}) as IDataObject;
            const customFields = this.getNodeParameter('customFields', i, {}) as IDataObject;
            
            // Process custom fields
            const processedCustomFields: IDataObject = {};
            if (customFields.customField && Array.isArray(customFields.customField)) {
              for (const field of customFields.customField as Array<{fieldId: string, fieldValue: string}>) {
                if (field.fieldId && field.fieldValue) {
                  processedCustomFields[field.fieldId] = field.fieldValue;
                }
              }
            }
            
            const fields = createParametersFromNodeParameter.call(
              this,
              { name, ...additionalFields, ...processedCustomFields },
            ) as OrganizationParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/create',
              'Organization',
              undefined,
              fields
            );

            responseData = extractObjectFromResponse<Organization>(response);
          }

          if (operation === 'get') {
            const organizationId = this.getNodeParameter('organizationId', i) as string;

            const response = await iTopApiRequest.call(
              this,
              'core/get',
              'Organization',
              organizationId,
              undefined,
              '*'
            );

            responseData = extractObjectFromResponse<Organization>(response);
          }

          if (operation === 'update') {
            const organizationId = this.getNodeParameter('organizationId', i) as string;
            const additionalFields = this.getNodeParameter('organizationFields', i, {}) as IDataObject;
            const customFields = this.getNodeParameter('customFields', i, {}) as IDataObject;
            
            // Process custom fields
            const processedCustomFields: IDataObject = {};
            if (customFields.customField && Array.isArray(customFields.customField)) {
              for (const field of customFields.customField as Array<{fieldId: string, fieldValue: string}>) {
                if (field.fieldId && field.fieldValue) {
                  processedCustomFields[field.fieldId] = field.fieldValue;
                }
              }
            }
            
            const fields = createParametersFromNodeParameter.call(
              this,
              { ...additionalFields, ...processedCustomFields },
            ) as OrganizationParameters;

            const response = await iTopApiRequest.call(
              this,
              'core/update',
              'Organization',
              organizationId,
              fields
            );

            responseData = extractObjectFromResponse<Organization>(response);
          }

			if (operation === 'delete') {
				const organizationId = this.getNodeParameter('organizationId', i) as string;

				await iTopApiRequest.call(
					this,
					'core/delete',
					'Organization',
					organizationId,
					{} // Empty fields object, comment will be added automatically
				);

				responseData = { success: true, id: organizationId };
			}          if (operation === 'getAll') {
            const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
            let oqlQuery = 'SELECT Organization';
            
            const conditions: string[] = [];
            if (additionalFields.status) {
              conditions.push(`status = '${additionalFields.status}'`);
            }
            if (additionalFields.parent_id) {
              conditions.push(`parent_id = ${additionalFields.parent_id}`);
            }

            if (conditions.length > 0) {
              oqlQuery += ` WHERE ${conditions.join(' AND ')}`;
            }

            responseData = await iTopApiRequestAllItems.call(
              this,
              'Organization',
              oqlQuery,
              '*'
            );
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } }
        );

        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: error.message }),
            { itemData: { item: i } }
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }

}