export const wait = (ms = 280): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
