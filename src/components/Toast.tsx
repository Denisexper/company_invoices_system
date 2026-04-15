interface Props {
  message: string;
}

export default function Toast({ message }: Props) {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#3a7a5a] text-white px-6 py-3 rounded-xl font-semibold text-sm z-[999] shadow-xl animate-[slideDown_0.3s_ease]">
      {message}
    </div>
  );
}