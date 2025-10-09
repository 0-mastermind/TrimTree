const WarningMessage = ({ message }: { message: string }) => {
  return (
    <div className="my-6 bg-yellow-200 py-2 px-4 rounded-md relative overflow-hidden">
      <p className="text-yellow-600">{message}</p>
      <div className="w-1.5 h-full bg-yellow-600 absolute top-0 left-0"></div>
    </div>
  );
};

export default WarningMessage;
