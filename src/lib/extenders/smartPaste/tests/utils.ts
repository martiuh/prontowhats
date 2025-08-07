export function createPasteEvent(html: string) {
  const text = html.replace('<[^>]*>', '');
  return {
    clipboardData: {
      types: ['text/plain', 'text/html'],
      getData: (type: string) => (type === 'text/plain' ? text : html),
    },
  };
}
