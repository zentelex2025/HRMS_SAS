export const Okay = (data) => ({
  success: true,
  res: data,
});

export const Err = (message) => ({
  success: false,
  res: message,
});
export async function ErrHandeler(promise) {
  try {
    return Okay(await promise);
  } catch (error) {
    return Err(error.message);
  }
}
