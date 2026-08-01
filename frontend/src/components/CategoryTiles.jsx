function CategoryTiles({ categories, selectedCategory, onSelect, t }) {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="flex gap-5 overflow-x-auto pb-2 px-1 scrollbar-hide">
        <button
          onClick={() => onSelect(null)}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF3F6C] to-[#FF9F00] border-2 ${
              selectedCategory === null ? 'border-[#282C3F]' : 'border-transparent'
            }`}
          >
            <span className="text-white text-xs font-bold">{t('allCategories')}</span>
          </div>
          <span className="text-xs text-[#282C3F] font-medium">{t('allCategories')}</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className="flex flex-col items-center gap-2 shrink-0"
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                selectedCategory === category.id ? 'border-[#FF3F6C]' : 'border-gray-200'
              }`}
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#F5F5F6] flex items-center justify-center">
                  <span className="text-lg font-bold text-[#7E818C]">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs text-[#282C3F] font-medium text-center max-w-[70px] truncate">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryTiles;