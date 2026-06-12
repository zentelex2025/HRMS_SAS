import { useMemo } from "react";

export const useBasicInfoClass = () => {
  return useMemo(
    () => ({
      className: "basic-info",
      classIdentification: "identification-info",
      classAddress: "address-info",
      classBank: "bank-details",
      classButton: "button",
    }),
    [],
  );
};
