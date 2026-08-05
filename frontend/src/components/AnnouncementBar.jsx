function AnnouncementBar() {
  const message =
    "📞 फोन करें: 9410725209  |  हमारे यहाँ मेकअप का सारा सामान मिलता है  |  वेडिंग ज्वेलरी उपलब्ध है  |  कुर्ती और प्लाज़ो की नई रेंज  |  बच्चों के खेलने का सामान और बच्चों के कपड़े भी उपलब्ध हैं  |  आज ही विजिट करें! Nail, Almora";

  return (
    <div className="bg-[#FF3F6C] overflow-hidden py-0.3 whitespace-nowrap">
      <div className="inline-block animate-marquee">
        <span className="text-white text-xs font-medium mx-4">{message}</span>
        <span className="text-white text-xs font-medium mx-4">{message}</span>
      </div>
    </div>
  );
}

export default AnnouncementBar;