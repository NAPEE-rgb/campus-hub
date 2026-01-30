import React from 'react';

export default function ProductCard({ product, addToCart }) {
  if (!product) return null;

  return (
    <div className="group relative z-0 bg-white rounded-[2rem] p-3 border border-gray-50 shadow-sm 
                    transition-all duration-500 
                    md:hover:scale-[1.08] md:hover:z-50 md:hover:shadow-2xl
                    active:scale-[1.05]">
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-[#F3F4F6] mb-3">
        <img 
          src={product.img || 'https://via.placeholder.com/400'} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-md text-black text-[7px] font-black uppercase px-2 py-1 rounded-lg shadow-sm">
            {product.category || 'New'}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="px-1">
        <h3 className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2 h-8">
          {product.name}
        </h3>
        
        <div className="mt-3 flex items-center justify-between bg-gray-50 p-2 rounded-xl">
          <div>
            <p className="text-[14px] font-black text-gray-900 leading-none">
              <span className="text-[9px] mr-0.5 text-orange-600 font-bold">GH₵</span>
              {product.price}
            </p>
          </div>

          {/* Plus Button beside price */}
          <button 
            onClick={() => addToCart(product)}
            className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors active:scale-90"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}