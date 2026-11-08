// Local interaction simulation only. No fetch, credentials, file bytes or production writes.
export function createPreviewSubmission(
  kinds,
  { failAt = "", delay = 0, onChange = () => {} } = {},
) {
  const state = {
    requestCreated: false,
    uploadedKinds: [],
    confirmed: false,
    requestCount: 0,
    completeCount: 0,
    busy: false,
    error: "",
    failedOnce: false,
  };
  const pause = () => new Promise((resolve) => setTimeout(resolve, delay));
  async function run() {
    if (state.busy || state.confirmed) return;
    state.busy = true;
    state.error = "";
    onChange(state);
    try {
      if (!state.requestCreated) {
        await pause();
        state.requestCreated = true;
        state.requestCount++;
        onChange(state);
      }
      for (const kind of kinds) {
        if (state.uploadedKinds.includes(kind)) continue;
        await pause();
        if (failAt === "upload" && !state.failedOnce) {
          state.failedOnce = true;
          throw new Error(
            "A document could not be uploaded. Your application and completed uploads are retained. Retry the remaining upload.",
          );
        }
        state.uploadedKinds.push(kind);
        onChange(state);
      }
      await pause();
      state.completeCount++;
      if (failAt === "complete" && !state.failedOnce) {
        state.failedOnce = true;
        throw new Error(
          "Submission could not be confirmed. Your documents are retained. Retry confirmation.",
        );
      }
      state.confirmed = true;
      onChange(state);
    } catch (error) {
      state.error = error.message;
    } finally {
      state.busy = false;
      onChange(state);
    }
  }
  return { state, run };
}
