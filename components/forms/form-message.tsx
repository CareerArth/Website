export function FormMessage({
  type,
  message,
}: {
  type: 'error' | 'success';
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return <p className={type === 'error' ? 'text-sm text-red-700' : 'text-sm text-forest'}>{message}</p>;
}
