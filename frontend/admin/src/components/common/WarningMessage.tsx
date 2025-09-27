const WarningMessage = ({ message }: { message: string }) => {
  return (
    <div className="my-6 bg-red-200 py-2 px-4 rounded-md">
      <p className="text-red-600">{message}</p>
    </div>
  );
};

export default WarningMessage;
