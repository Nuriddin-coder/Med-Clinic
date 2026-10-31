"use client";

export {
  Button,
  PrimaryButton,
  SecondaryButton,
  type ButtonProps,
} from "./button";

import {
  PrimaryButton,
  SecondaryButton,
  type ButtonProps,
} from "./button";

export interface DynamicButtonProps extends ButtonProps {
  buttonType?: "primary" | "secondary";
}

export const DynamicButton = ({
  buttonType = "primary",
  ...props
}: DynamicButtonProps) => {
  if (buttonType === "secondary") {
    return <SecondaryButton {...props} />;
  }
  return <PrimaryButton {...props} />;
};
