import { ComponentType } from "react";

export const hoc = function <SP extends {}, HP extends {}>(
  hook: (props: Partial<SP>) => HP,
  Component: ComponentType<HP & SP>,
  displayName?: string
) {
  const Result = (props: SP) => {
    const hookProps = hook(props);
    return <Component {...hookProps} {...props} />;
  };

  if (displayName) {
    Result.displayName = displayName;
  }

  Result.hook = hook;
  Result.Original = Component;

  return Result as ComponentType<Partial<HP> & Partial<SP>> & {
    Original: ComponentType<HP & SP>;
    hook: typeof hook;
  };
};
