
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

  /** The requested item does not exist in out repository*/
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

}