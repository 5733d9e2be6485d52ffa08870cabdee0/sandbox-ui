/* tslint:disable */
/* eslint-disable */
/**
 * Red Hat Openshift SmartEvents Fleet Manager
 * The api exposed by the fleet manager of the SmartEvents service.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: openbridge-dev@redhat.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { KafkaConnectionDTO } from './kafka-connection-dto';
import { ManagedResourceStatus } from './managed-resource-status';

/**
 * 
 * @export
 * @interface BridgeDTO
 */
export interface BridgeDTO {
    /**
     * 
     * @type {string}
     * @memberof BridgeDTO
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof BridgeDTO
     */
    'name'?: string;
    /**
     * 
     * @type {string}
     * @memberof BridgeDTO
     */
    'endpoint'?: string;
    /**
     * 
     * @type {string}
     * @memberof BridgeDTO
     */
    'customerId'?: string;
    /**
     * 
     * @type {ManagedResourceStatus}
     * @memberof BridgeDTO
     */
    'status'?: ManagedResourceStatus;
    /**
     * 
     * @type {KafkaConnectionDTO}
     * @memberof BridgeDTO
     */
    'kafkaConnection'?: KafkaConnectionDTO;
}

