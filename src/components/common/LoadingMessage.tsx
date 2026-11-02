interface LoadingMessageProps {
  message?: string;
}

export default function LoadingMessage({ message = 'Đang tải...' }: LoadingMessageProps) {
  return (
    <p className="state-message" role="status">
      {message}
    </p>
  );
}
