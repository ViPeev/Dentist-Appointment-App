
const CloseButton: React.FC = ({ closeModal, text }) => {
  return (
    <button
      type="button"
      className="inline-flex group absolute w-8 h-8 top-0 right-0 justify-center items-center rounded-full bg-cyan-600 text-sm text-white font-light shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:col-start-2 transition"
      onClick={closeModal}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.2}
        stroke="currentColor"
        className="w-4 h-4 group-hover:w-5 group-hover:h-5 transition-all"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
