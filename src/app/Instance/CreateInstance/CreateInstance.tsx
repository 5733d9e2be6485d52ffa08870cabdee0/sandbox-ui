import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  AlertGroup,
  Button,
  Form,
  FormAlert,
  FormGroup,
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
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";
import { GetCloudProvidersRegion } from "../../../hooks/useCloudProvidersApi/useGetCloudProvidersRegionsApi";

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
    cloudRegionId: string
  ) => void;
  /** API error related to bridge creation */
  createBridgeError: unknown;
  /** Callback to retrieve cloud providers options **/
  getCloudProviders: GetCloudProviders;
  /** Callback to retrieve cloud regions options **/
  getCloudRegions: GetCloudProvidersRegion;
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
  const [error, setError] = useState<string | null>(null);
  const [genericError, setGenericError] = useState<string | null>(null);
  const [cloudProviderUnavailable, setCloudProviderUnavailable] =
    useState(false);
  const [existingInstanceName, setExistingInstanceName] = useState<
    string | null
  >(null);
  const [newBridgeName, setNewBridgeName] = useState("");

  const { t } = useTranslation("openbridgeTempDictionary");

  const FORM_ID = "create-instance-form";

  const validate = useCallback(() => {
    if (name.trim() === "") {
      setError(t("common.required"));
      return false;
    }
    if (existingInstanceName && name.trim() === existingInstanceName) {
      setError(t("instance.errors.invalidName"));
      return false;
    }
    setError(null);
    setGenericError(null);
    return true;
  }, [name, t, existingInstanceName]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (validate()) {
        const newName = name.trim();
        onCreate(newName, cloudProviderId, cloudRegionId);
        setNewBridgeName(newName);
      }
    },
    [name, cloudProviderId, cloudRegionId, onCreate, validate]
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
      setError(null);
      setGenericError(null);
      setCloudProviderUnavailable(false);

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
    if (error) {
      return t("common.addressFormErrors");
    }

    return t("instance.errors.cantCreateInstance");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      onClose={(): void => {
        setError(null);
        setGenericError(null);
        setExistingInstanceName(null);
        onClose();
      }}
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
        <Button key="cancel" ouiaId="cancel" variant="link" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <Form id={FORM_ID} onSubmit={onSubmit}>
        {(error || genericError) && (
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
          validated={error ? "error" : "default"}
          helperTextInvalid={error}
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
            validated={error ? "error" : "default"}
            isDisabled={formIsDisabled}
          />
        </FormGroup>

        <CloudProviderSelection
          cloudProviders={cloudProviders}
          cloudRegions={cloudRegions}
          onCloudProviderChange={handleProviderChange}
          isDisabled={formIsDisabled}
        />

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
