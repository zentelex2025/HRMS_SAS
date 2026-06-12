import React from "react";
import { BasicInfo } from "@/shared/components/BasicInfo";
import { useBasicInfoClass } from "../hooks/useBasicInfo";
import {
  IdentificationInfo,
  AddressInfo,
  BankDetails,
} from "@/shared/components/BasicInfoAll";
import "./newEmployee.scss";
import Button from "@/shared/components/Button";

const NewEmployee = () => {
  return (
    <section className="employee-create-page">
      <BasicInfo {...useBasicInfoClass()} />
      <IdentificationInfo {...useBasicInfoClass()} />
      <AddressInfo {...useBasicInfoClass()} />
      <BankDetails {...useBasicInfoClass()} />
      <Button {...useBasicInfoClass()} />
    </section>
  );
};

export default NewEmployee;
