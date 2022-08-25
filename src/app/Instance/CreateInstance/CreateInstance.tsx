import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  AlertGroup,
  Button,
  Form,
  FormAlert,
  FormGroup,
  FormSection,
  Modal,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import CloudProviderSelection from "@app/Instance/CreateInstance/CloudProviderSelection";
import { GetCloudProviders } from "../../../hooks/useCloudProvidersApi/useGetCloudProvidersApi";
import {
  Action,
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";
import { GetCloudProvidersRegion } from "../../../hooks/useCloudProvidersApi/useGetCloudProvidersRegionsApi";
import { ErrorHandlingSelection } from "@app/Instance/CreateInstance/ErrorHandlingSelection";
import { ERROR_HANDLING_METHODS } from "../../../types/ErrorHandlingMethods";
import ConfigurationForm from "@app/Processor/ProcessorEdit/ConfigurationForm/ConfigurationForm";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import { ProcessorSchemaType } from "../../../types/Processor";

export interface CreateInstanceProps {
  /** Flag to indicate the creation request is in progress */
  isLoading: boolean;
  /** Flag to show/hide the modal */
  isModalOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback to create the instance */
  onCreate: (
    name: string,
    cloudProviderId: string,
    cloudRegionId: string,
    errorHandlingConfiguration?: Action
  ) => void;
  /** API error related to bridge creation */
  createBridgeError: unknown;
  /** Callback to retrieve cloud providers options **/
  getCloudProviders: GetCloudProviders;
  /** Callback to retrieve cloud regions options **/
  getCloudRegions: GetCloudProvidersRegion;
  /** Callback to retrieve the schema used in error handling configuration */
  getSchema: GetSchema;
}

const CreateInstance = (props: CreateInstanceProps): JSX.Element => {
  const {
    isLoading,
    isModalOpen,
    onClose,
    onCreate,
    createBridgeError,
    getCloudProviders,
    getCloudRegions,
    getSchema,
  } = props;
  const [name, setName] = useState("");
  const [cloudProviderId, setCloudProviderId] = useState("");
  const [cloudRegionId, setCloudRegionId] = useState("");
  const [cloudProviders, setCloudProviders] = useState<CloudProviderResponse[]>(
    []
  );
  const [cloudRegions, setCloudRegions] = useState<
    CloudRegionResponse[] | undefined
  >();
  const [nameError, setNameError] = useState<string | null>(null);
  const [hasParametersError, setHasParametersError] = useState<boolean>(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  const [cloudProviderUnavailable, setCloudProviderUnavailable] =
    useState(false);
  const [existingInstanceName, setExistingInstanceName] = useState<
    string | null
  >(null);
  const [newBridgeName, setNewBridgeName] = useState("");
  const [errorHandlingSchemaId, setErrorHandlingSchemaId] = useState<
    string | null
  >(null);
  const [errorHandlingSchema, setErrorHandlingSchema] = useState<object>();
  const [errorHandlingSchemaLoading, setErrorHandlingSchemaLoading] =
    useState<boolean>(false);
  const [errorHandlingParameters, setErrorHandlingParameters] = useState({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { t } = useTranslation("openbridgeTempDictionary");

  const FORM_ID = "create-instance-form";

  const validateParameters = useRef<(() => boolean) | undefined>();

  const registerValidateParameters = (callback: () => boolean): void => {
    validateParameters.current = callback;
  };

  const hasValidName = useCallback(() => {
    if (name.trim() === "") {
      setNameError(t("common.required"));
      return false;
    }
    if (existingInstanceName && name.trim() === existingInstanceName) {
      setNameError(t("instance.errors.invalidName"));
      return false;
    }

    return true;
  }, [existingInstanceName, name, t]);

  const hasValidParams = useCallback(() => {
    const validParameters = validateParameters.current?.();
    if (validParameters === false) {
      setHasParametersError(true);
      return false;
    }

    return true;
  }, []);

  const validate = useCallback(() => {
    setNameError(null);
    setHasParametersError(false);
    setGenericError(null);

    const validName = hasValidName();
    const validParams = hasValidParams();

    return validName && validParams;
  }, [hasValidName, hasValidParams]);

  useEffect(() => {
    if (isSubmitted || nameError || genericError) {
      document
        .querySelector(".pf-m-error")
        ?.previousElementSibling?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      setIsSubmitted(false);
    }
  }, [isSubmitted, nameError, genericError]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      setIsSubmitted(true);
      event.preventDefault();
      if (validate()) {
        const newName = name.trim();
        let errorHandlingConfiguration;
        if (errorHandlingSchemaId) {
          errorHandlingConfiguration = {
            type: errorHandlingSchemaId,
            parameters: errorHandlingParameters,
          };
        }
        onCreate(
          newName,
          cloudProviderId,
          cloudRegionId,
          errorHandlingConfiguration
        );
        setNewBridgeName(newName);
      }
    },
    [
      validate,
      name,
      onCreate,
      cloudProviderId,
      cloudRegionId,
      errorHandlingSchemaId,
      errorHandlingParameters,
    ]
  );

  const handleNameChange = useCallback(
    (name: string) => {
      setName(name);
      if (existingInstanceName) {
        validate();
      }
    },
    [existingInstanceName, validate]
  );

  const handleProviderChange = useCallback(
    (providerId: string, regionId: string) => {
      if (providerId !== cloudProviderId) {
        setCloudProviderId(providerId);
      }
      if (regionId !== cloudRegionId) {
        setCloudRegionId(regionId);
      }
    },
    [cloudProviderId, cloudRegionId]
  );

  const retrieveCloudProviders = useCallback((): void => {
    getCloudProviders()
      .then((providers) => setCloudProviders(providers))
      .catch(() => setGenericError("Internal Server Error"));
  }, [getCloudProviders]);

  const retrieveCloudRegions = useCallback(
    (cloudProviderId: string): void => {
      getCloudRegions(cloudProviderId)
        .then((regions) => setCloudRegions(regions))
        .catch(() => setGenericError("Internal server error"));
    },
    [getCloudRegions]
  );

  useEffect(() => {
    if (existingInstanceName) {
      validate();
    }
  }, [existingInstanceName, validate]);

  useEffect(() => {
    if (isModalOpen) {
      setName("");
      setCloudProviderId("");
      setCloudRegionId("");
      setExistingInstanceName(null);
      setNameError(null);
      setHasParametersError(false);
      setGenericError(null);
      setCloudProviderUnavailable(false);
      setErrorHandlingSchemaId(null);
      setErrorHandlingParameters({});

      retrieveCloudProviders();
    } else {
      setCloudProviders([]);
      setCloudRegions(undefined);
    }
  }, [isModalOpen, retrieveCloudProviders]);

  useEffect(() => {
    if (cloudProviderId) {
      retrieveCloudRegions(cloudProviderId);
    }
  }, [cloudProviderId, retrieveCloudRegions]);

  useEffect(() => {
    // If there are no enabled cloud providers or regions, block the creation of the bridge
    if (
      (cloudProviders.length > 0 &&
        cloudProviders.filter((provider) => provider.enabled).length === 0) ||
      (cloudRegions &&
        cloudRegions.length > 0 &&
        cloudRegions.filter((region) => region.enabled).length === 0)
    ) {
      setCloudProviderUnavailable(true);
    }
  }, [cloudRegions, cloudProviders]);

  useEffect(() => {
    setErrorHandlingSchema({});
    if (errorHandlingSchemaId) {
      setErrorHandlingSchemaLoading(true);
      getSchema(errorHandlingSchemaId, ProcessorSchemaType.ACTION)
        .then((data) => setErrorHandlingSchema(data))
        .catch(() => setGenericError("Internal Server Error"))
        .finally(() => setErrorHandlingSchemaLoading(false));
    }
  }, [errorHandlingSchemaId, getSchema]);

  useEffect(() => {
    if (createBridgeError) {
      if (isServiceApiError(createBridgeError)) {
        const errorCode = getErrorCode(createBridgeError);
        switch (errorCode) {
          case APIErrorCodes.ERROR_1:
            setExistingInstanceName(newBridgeName);
            break;
          case APIErrorCodes.ERROR_33:
          case APIErrorCodes.ERROR_34:
            // When the cloud provider or region used to create a bridge
            // become unavailable, we can disable the creation form because
            // we only support 1 provider and 1 region.
            // This will of course change when we'll expand the cloud provider support.
            setCloudProviderUnavailable(true);
            break;
          default:
            setGenericError(
              createBridgeError.response?.statusText ?? "Internal Server Error"
            );
            break;
        }
      }
    }
  }, [createBridgeError, newBridgeName, retrieveCloudProviders]);

  const formIsDisabled = useMemo(
    () => isLoading || cloudProviderUnavailable,
    [cloudProviderUnavailable, isLoading]
  );

  const getFormAlertError = (): string => {
    if (nameError || hasParametersError) {
      return t("common.addressFormErrors");
    }

    return t("instance.errors.cantCreateInstance");
  };

  const onCloseModal = (): void => {
    setNameError(null);
    setHasParametersError(false);
    setGenericError(null);
    setExistingInstanceName(null);
    setErrorHandlingSchemaId(null);
    onClose();
  };

  return (
    <Modal
      position="top"
      isOpen={isModalOpen}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      onClose={onCloseModal}
      actions={[
        <Button
          key="submit"
          ouiaId="submit"
          variant="primary"
          type="submit"
          form={FORM_ID}
          isDisabled={formIsDisabled}
          spinnerAriaValueText={t("common.submittingRequest")}
          isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button
          key="cancel"
          ouiaId="cancel"
          variant="link"
          onClick={onCloseModal}
        >
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        {(nameError || genericError || hasParametersError) && (
          <FormAlert>
            <Alert
              ouiaId="error-instance-create-fail"
              variant="danger"
              title={getFormAlertError()}
              aria-live="polite"
              isInline
            />
          </FormAlert>
        )}
        {cloudProviderUnavailable && (
          <FormAlert>
            <Alert
              variant="warning"
              title={t("instance.creationTemporaryUnavailable")}
              aria-live="polite"
              isInline
            >
              <p>{t("instance.cloudRegionsUnavailable")}</p>
            </Alert>
          </FormAlert>
        )}
        <FormGroup
          label={t("common.name")}
          isRequired
          fieldId="instance-name"
          validated={nameError ? "error" : "default"}
          helperTextInvalid={nameError}
        >
          <TextInput
            isRequired
            ouiaId="new-name"
            type="text"
            maxLength={255}
            id="instance-name"
            name="instance-name"
            value={name}
            onChange={handleNameChange}
            onBlur={validate}
            validated={nameError ? "error" : "default"}
            isDisabled={formIsDisabled}
          />
        </FormGroup>

        <CloudProviderSelection
          cloudProviders={cloudProviders}
          cloudRegions={cloudRegions}
          onCloudProviderChange={handleProviderChange}
          isDisabled={formIsDisabled}
        />

        <FormSection title={t("common.errorHandling")} titleElement="h2">
          <FormGroup
            label={t("common.errorHandlingMethod")}
            fieldId={"error-handling-method"}
            isRequired
          >
            <ErrorHandlingSelection
              defaultMethod={ERROR_HANDLING_METHODS.default.value}
              errorHandlingMethods={ERROR_HANDLING_METHODS}
              isDisabled={formIsDisabled}
              onMethodSelection={(errorMethod: string): void => {
                setErrorHandlingParameters({});
                if (errorMethod === ERROR_HANDLING_METHODS.default.value) {
                  setErrorHandlingSchemaId(null);
                } else {
                  setErrorHandlingSchemaId(errorMethod);
                }
              }}
            />
          </FormGroup>
          {errorHandlingSchema && !errorHandlingSchemaLoading && (
            <ConfigurationForm
              configuration={errorHandlingParameters}
              schema={errorHandlingSchema}
              onChange={(model): void => {
                setErrorHandlingParameters(model as Record<string, unknown>);
                setHasParametersError(false);
              }}
              registerValidation={registerValidateParameters}
              readOnly={formIsDisabled}
            />
          )}
        </FormSection>

        <AlertGroup>
          <Alert
            variant="info"
            ouiaId="info-instance-available-soon"
            isInline={true}
            isPlain={true}
            title={t("instance.instanceWillBeAvailableShortly")}
          />
        </AlertGroup>
      </Form>
    </Modal>
  );
};

export default CreateInstance;
