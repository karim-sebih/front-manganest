import { useRef } from "react";

export default function Carousel({ title, items, renderItem }) {
    const scrollRef = useRef();

    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const container = scrollRef.current;
        const card = container.querySelector("div"); // 1ère card

        if (!card) return;

        const cardWidth = card.offsetWidth + 16; // gap-4 = 16px

        container.scrollBy({
            left: direction === "left" ? -cardWidth : cardWidth,
            behavior: "smooth",
        });
    };


    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{title}</h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        ◀
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                    >
                        ▶
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="
        flex gap-4 overflow-x-auto scroll-smooth
        custom-scrollbar
        pb-2
    "
            >

                {items.length === 0 ? (
                    <p className="text-gray-400">Aucun contenu</p>
                ) : (
                    items.map((item, index) => (
                        <div key={item.mangadex_id} className="min-w-[150px] flex-shrink-0">
                            {renderItem(item)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
