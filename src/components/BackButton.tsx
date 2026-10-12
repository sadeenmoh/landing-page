export default function BackButton() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleBack}
      className="absolute top-4 left-4 z-30 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition border border-gray-100"
      aria-label="رجوع"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  )
}