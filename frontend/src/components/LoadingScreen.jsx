function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-[#FFE1EA]" />
        <div className="absolute inset-0 rounded-full border-4 border-[#FF3F6C] border-t-transparent animate-spin-slow" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-b-[#D4AF37] animate-spin-slow"
          style={{ animationDirection: 'reverse', animationDuration: '1.4s' }}
        />
      </div>

      <div className="text-center">
        <p className="text-[#282C3F] font-black text-lg tracking-tight">
          Bisht <span className="font-light uppercase tracking-[0.18em] text-[0.8em]">Cosmetic</span>
        </p>
        <p className="text-[#7E818C] text-xs mt-1">{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;