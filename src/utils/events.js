export const PRD_EVENTS = {
  PIN_TOGGLED: 'prd-pin-toggled',
  ARCHIVE_TOGGLED: 'prd-archive-toggled',
  PRD_DELETED: 'prd-deleted',
  PRD_UPDATED: 'prd-updated'
};

export const emitEvent = (event, data) => {
  console.log(`Emitting event: ${event}`, data);
  const customEvent = new CustomEvent(event, { detail: data });
  document.dispatchEvent(customEvent);
};