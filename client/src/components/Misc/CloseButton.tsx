const CloseButton: React.FC = ({ closeModal, text }) => {
  return (
    <button
      type="button"
      className="inline-flex absolute w-8 h-8 top-0 right-0 justify-center items-center rounded-full bg-cyan-600 text-sm text-white font-light shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 sm:col-start-2 transition"
      onClick={closeModal}
    >
      &#10005;
    </button>
  );
};

export default CloseButton;
