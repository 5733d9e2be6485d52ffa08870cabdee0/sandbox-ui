/* tslint:disable */
/* eslint-disable */
/**
 * Red Hat Openshift Smart Events Fleet Manager
 * The api exposed by the fleet manager of the RHOSE service.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: openbridge-dev@redhat.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { ErrorResponse } from './error-response';

/**
 * 
 * @export
 * @interface InlineResponse2002
 */
export interface InlineResponse2002 {
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2002
     */
    'kind'?: string;
    /**
     * 
     * @type {Array<ErrorResponse>}
     * @memberof InlineResponse2002
     */
    'items'?: Array<ErrorResponse>;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2002
     */
    'page'?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2002
     */
    'size'?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2002
     */
    'total'?: number;
}

