"use client";

import { Button, ButtonProps } from "./button";

export const PrimaryButton = ({ className, ...props }: ButtonProps) => (
  <Button className={className} {...props} />
);

