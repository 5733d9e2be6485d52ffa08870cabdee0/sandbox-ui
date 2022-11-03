
/**
   smart_events error codes

    ```ts
    apiCall.then((data) => {
        console.log(data?.data.items)
    }).catch((err) => {
      if(APIErrorCodes.ERROR_5 == err.response?.data.code) {
        // Handle error
      }
    })
    ```
*/
export const APIErrorCodes = {
  /** You tried to create an object which already exist in our repository*/
  ERROR_1 : "OPENBRIDGE-1", 

  /** You tried a life cycle transition which is not allowed*/
  ERROR_2 : "OPENBRIDGE-2", 

  /** We were unable to process your request. Please contact Red Hat support if the error persists.*/
  ERROR_3 : "OPENBRIDGE-3", 

  /** You tried to create an object which already exist in our repository*/
  ERROR_4 : "OPENBRIDGE-4", 

  /** You try to serialize a cloud event and something goes wrong, check if format follows specification*/
  ERROR_5 : "OPENBRIDGE-5", 

  /** You try to deserialize a cloud event and something goes wrong, check if format follows specification*/
  ERROR_6 : "OPENBRIDGE-6", 

  /** Something failed related with gateway execution or resolution*/
  ERROR_7 : "OPENBRIDGE-7", 

  /** The request is not valid.*/
  ERROR_8 : "OPENBRIDGE-8", 

  /** There was an internal exception. This is supposed not to be fixable by the user, so you should open a bug with all the information you have.*/
  ERROR_9 : "OPENBRIDGE-9", 

  /** The user is not authorized to access the resource*/
  ERROR_16 : "OPENBRIDGE-16", 

  /** You tried a life cycle transition which is not allowed*/
  ERROR_19 : "OPENBRIDGE-19", 

  /** The Transformation Template for the Processor is invalid*/
  ERROR_22 : "OPENBRIDGE-22", 

  /** The Processor is missing a Gateway definition.*/
  ERROR_23 : "OPENBRIDGE-23", 

  /** The Processor Gateway definition is missing parameters.*/
  ERROR_24 : "OPENBRIDGE-24", 

  /** The Processor Gateway type is not recognised.*/
  ERROR_25 : "OPENBRIDGE-25", 

  /** One or more of the Processor Gateway parameters are invalid.*/
  ERROR_26 : "OPENBRIDGE-26", 

  /** One or more of the Processor Gateway parameters are invalid.*/
  ERROR_27 : "OPENBRIDGE-27", 

  /** A Processor cannot have both a Source and an Action Gateway defined.*/
  ERROR_28 : "OPENBRIDGE-28", 

  /** Processor Source Gateways do not support Transformation Templates.*/
  ERROR_29 : "OPENBRIDGE-29", 

  /** The specified ErrorHandler Action is unsupported.*/
  ERROR_30 : "OPENBRIDGE-30", 

  /** Unable to deserialize Filter definition.*/
  ERROR_32 : "OPENBRIDGE-32", 

  /** The selected Cloud Provider is not valid.*/
  ERROR_33 : "OPENBRIDGE-33", 

  /** The selected Region is not valid.*/
  ERROR_34 : "OPENBRIDGE-34", 

  /** The requested resource could not be deployed because you are out of available quota.*/
  ERROR_40 : "OPENBRIDGE-40", 

  /** Terms not accepted yet.*/
  ERROR_41 : "OPENBRIDGE-41", 

}