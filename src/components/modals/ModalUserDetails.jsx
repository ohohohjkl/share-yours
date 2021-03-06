import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import "../../assets/css/modal.css";
import { AiOutlineUserSwitch } from "react-icons/ai";

import { getAccountInfo, login, logout } from "../../utils/near";
import { client, urlFor } from "../../client";

export const ModalUserDetails = ({ isOpen = false, closeModal, data }) => {
  const { _id } = data;
  const [showModal, setShowModal] = useState(false);

  const isAttachedNear = window.walletConnection.isSignedIn();

  useEffect(async () => {
    // in this case, we only care to query the contract when signed in
    if (isAttachedNear) {
      // window.contract is set by initContract in index.js
      const greetingFromContract = window.contract.getGreeting({
        accountId: window.accountId,
      });
      // setGreeting(greetingFromContract);

      const { accountId } = getAccountInfo();
      client.patch(_id).set({ nearUser: accountId }).commit();
    } else client.patch(_id).set({ nearUser: "" }).commit();
  }, [isAttachedNear]);

  useEffect(async () => {
    console.log({ data: getAccountInfo() });
    setShowModal(isOpen);
  }, [isOpen]);

  return (
    <Modal active={showModal} toggler={closeModal} size="lg">
      <ModalHeader toggler={closeModal}>User Details</ModalHeader>
      <ModalBody>
        <div className="divCenter600">
          <img src={data?.image} alt="nothing to show" className="modalAVT" />
        </div>
        <div className="modalLabel">
          User Name
          <div className="infoArea">{data?.userName}</div>
        </div>
        <div className="modalLabel">
          User ID
          <div className="infoArea">{data?._id}</div>
        </div>
        <div
          className="modalLabel"
          style={{ position: "relative", marginTop: 28 }}
        >
          <div>
            <AiOutlineUserSwitch className="attachIcon" />
          </div>
          <div
            className="attachButton"
            onClick={() => {
              if (isAttachedNear) logout();
              else login();
            }}
          >
            {isAttachedNear
              ? `Unlink ${window.accountId}`
              : "Link NEAR account"}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={closeModal}
          ripple="dark"
        >
          Close
        </Button>

        <Button
          color="green"
          onClick={(e) => setShowModalCode(false)}
          ripple="light"
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};
