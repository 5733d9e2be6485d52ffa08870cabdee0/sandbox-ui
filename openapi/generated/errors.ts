
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
  /** There was an internal exception. This is supposed not to be fixable by the user, so you should open a bug with all the information you have.*/
  ERROR_1 : "OPENBRIDGE-1", 

  /** We were unable to process your request. Please contact Red Hat support if the error persists.*/
  ERROR_2 : "OPENBRIDGE-2", 

  /** You tried to create an object which already exist in our repository*/
  ERROR_3 : "OPENBRIDGE-3", 

  /** You tried a life cycle transition which is not allowed*/
  ERROR_4 : "OPENBRIDGE-4", 

  /** You tried to retrieve an object that does not exist in our repository*/
  ERROR_5 : "OPENBRIDGE-5", 

  /** The request is not valid.*/
  ERROR_6 : "OPENBRIDGE-6", 

  /** The user is not authorized to access the resource*/
  ERROR_10 : "OPENBRIDGE-10", 

  /** You tried a life cycle transition which is not allowed*/
  ERROR_11 : "OPENBRIDGE-11", 

  /** The selected Cloud Provider is not valid.*/
  ERROR_13 : "OPENBRIDGE-13", 

  /** The selected Region is not valid.*/
  ERROR_14 : "OPENBRIDGE-14", 

  /** The requested resource could not be deployed because you are out of available quota.*/
  ERROR_16 : "OPENBRIDGE-16", 

  /** Terms not accepted yet.*/
  ERROR_17 : "OPENBRIDGE-17", 

};