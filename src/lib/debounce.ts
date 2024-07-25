let timeout: number;

export const debounce = (
  callback: Function,
  timeoutInSeconds: number = 250
) => {
  // Clear any previous timeouts
  clearTimeout(timeout);

  // Set a new timeout of 500 milliseconds (adjust as needed)
  timeout = setTimeout(() => {
    // Your onchange event handler code here
    callback();
  }, timeoutInSeconds);
};
