const apiEndpoint = {
  // India endpoint
  EVISA_USER_LOGIN: '/visa/travel-to-india-services/loginEvisaUser',
  VISA_ADD_STEP1: '/visa/travel-to-india-services/add/step-one',
  UPDATE_VISA_ADD_STEP1: '/visa/travel-to-india-services/viewVisaRequestForm',
  UPDATE_VISA_ADD_STEP1_LAST_EXIT_STEP_URL:
    '/visa/travel-to-india-services/viewVisaRequestFormLastExitStepUrl',

  UPDATE_VISA_FORM_PAYMENT:
    '/visa/travel-to-india-services/viewVisaRequestFormPayment',

  GET_VISA_STEP1_BY_ID: '/visa/travel-to-india-services/viewVisaRequestForm/',
  VISA_ADD_STEP2: '/visa/travel-to-india-services/add/step-two',
  UPDATE_VISA_ADD_STEP2: '/visa/travel-to-india-services/viewVisaRequestForm2',
  GET_VISA_STEP2_BY_FORM_ID:
    '/visa/travel-to-india-services/viewVisaRequestForm2ByFormId/',
  VISA_ADD_STEP3: '/visa/travel-to-india-services/add/step-three',
  UPDATE_VISA_ADD_STEP3: '/visa/travel-to-india-services/viewVisaRequestForm3',
  VISA_ADD_STEP4: '/visa/travel-to-india-services/add/step-four',
  UPDATE_VISA_ADD_STEP4: '/visa/travel-to-india-services/viewVisaRequestForm4',
  VISA_ADD_STEP5: '/visa/travel-to-india-services/add/step-five',
  UPDATE_VISA_ADD_STEP5: '/visa/travel-to-india-services/viewVisaRequestForm5',
  VISA_ADD_STEP6: '/visa/travel-to-india-services/add/step-six',
  VISA_ADD_STEP8: '/visa/travel-to-india-services/add/step-eight',
  GET_VISA_STEP8_BY_FORM_ID:
    '/visa/travel-to-india-services/viewVisaRequestForm8ByFormId/',
  GET_ALL_STEPS_DATA: '/visa/travel-to-india-services/getAllStepData/',

  // Image upload endpoints
  UPLOAD_SINGLE_IMAGE: '/api/v1/upload/single',
  UPLOAD_MULTIPLE_IMAGES: '/api/v1/upload/multiple',
  DELETE_IMAGE: '/api/v1/upload',

  // temporary exit
  VISA_ADD_TEMPORARY_EXIT:
    '/visa/travel-to-india-services/visaLastTemporaryExitUrl',
  VISA_GET_TEMPORARY_EXIT_BY_FORM_ID:
    '/visa/travel-to-india-services/visaLastTemporaryExitUrl/',

  // payment routes
  INDIA_VISA_PAYMENT: '/visa/travel-to-india-services/indiaVisa',
};

export default apiEndpoint;
