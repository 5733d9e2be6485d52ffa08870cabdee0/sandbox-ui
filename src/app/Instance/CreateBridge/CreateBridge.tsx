import React, { VoidFunctionComponent } from "react";
import CreateBridgeMachine from "@app/Instance/CreateBridge/machines/createBridgeMachine";
import { useMachine } from "@xstate/react";
import { useGetCloudProvidersApi } from "../../../hooks/useCloudProvidersApi/useGetCloudProvidersApi";
import { Button, Modal } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

interface CreateBridgeProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBridge: VoidFunctionComponent<CreateBridgeProps> = (props) => {
  const { isOpen, onClose } = props;

  return <>{isOpen && <CreatBridgeDialog onClose={onClose} />}</>;
};

export default CreateBridge;

interface CreateBridgeDialogProps {
  onClose: () => void;
}

const CreatBridgeDialog: VoidFunctionComponent<CreateBridgeDialogProps> = ({
  onClose,
}) => {
  const { getCloudProviders } = useGetCloudProvidersApi();
  const [current] = useMachine(CreateBridgeMachine, {
    services: { fetchCloudProviders: () => getCloudProviders() },
  });
  const { t } = useTranslation(["openbridgeTempDictionary"]);

  return (
    <Modal
      position="top"
      isOpen={true}
      title={t("instance.createASEInstance")}
      ouiaId="create-instance"
      width={640}
      // onClose={onCloseModal}
      actions={[
        <Button
          key="submit"
          ouiaId="submit"
          variant="primary"
          type="submit"
          form={"FORM_ID"}
          // isDisabled={formIsDisabled}
          spinnerAriaValueText={t("common.submittingRequest")}
          // isLoading={isLoading}
        >
          {t("instance.createSEInstance")}
        </Button>,
        <Button key="cancel" ouiaId="cancel" variant="link" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
      ]}
    >
      <ul>
        {current.context.providers.cloudProviders &&
          current.context.providers.cloudProviders.map((provider) => (
            <li key={provider.id}>{provider.name}</li>
          ))}
      </ul>
    </Modal>
  );
};
