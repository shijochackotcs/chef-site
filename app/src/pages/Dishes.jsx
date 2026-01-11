import DishCard from "../components/DishCard.jsx";
import VideoCard from "../components/VideoCard.jsx";

const seedDishes = [
  {
    name: "Margherita Pizza",
    description: "Classic with fresh basil",
    price: 12.0,
    image:
      "https://images.unsplash.com/photo-1548365328-9f3f0c35a1b3?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Steak Au Poivre",
    description: "Peppercorn sauce",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Ramen Bowl",
    description: "Rich broth, soft-boiled egg",
    price: 13.5,
    image:
      "https://images.unsplash.com/photo-1543353071-087092ec393a?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Sushi Platter",
    description: "Assorted nigiri & rolls",
    price: 22.0,
    image:
      "https://images.unsplash.com/photo-1546069901-5ec6a79120b0?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Tacos Trio",
    description: "Carnitas, pollo, veggie",
    price: 11.0,
    image:
      "https://images.unsplash.com/photo-1601924638867-3ec4b11c1752?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Cheesecake",
    description: "Berries compote",
    price: 7.5,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Lemon Cheesecake Pavlova",
    description: "Citrus meringue layers",
    price: 8.5,
    image: "/placeholder.svg",
  },
  {
    name: "Herbed Roast Chicken",
    description: "Garlic and rosemary",
    price: 16.0,
    image: "/placeholder.svg",
  },
  {
    name: "Mushroom Risotto",
    description: "Creamy arborio rice",
    price: 14.0,
    image: "/placeholder.svg",
  },
  {
    name: "Caprese Salad",
    description: "Tomato, mozzarella, basil",
    price: 9.5,
    image: "/placeholder.svg",
  },
  {
    name: "Shrimp Scampi",
    description: "Lemon butter sauce",
    price: 17.0,
    image: "/placeholder.svg",
  },
  {
    name: "Beef Bourguignon",
    description: "Red wine braise",
    price: 23.0,
    image: "/placeholder.svg",
  },
  {
    name: "Veggie Stir-Fry",
    description: "Seasonal vegetables",
    price: 12.0,
    image: "/placeholder.svg",
  },
  {
    name: "Panna Cotta",
    description: "Vanilla cream dessert",
    price: 7.0,
    image: "/placeholder.svg",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Molten center",
    price: 8.0,
    image: "/placeholder.svg",
  },
];

export default function Dishes() {
  const addedRaw = localStorage.getItem("chefsite_dishes_v1");
  const added = addedRaw ? JSON.parse(addedRaw) : [];
  const images = added.filter((d) => d.type === "image");
  const videos = added.filter((d) => d.type === "youtube");
  const MIN_COUNT = 15;
  const displayImages =
    images.length >= MIN_COUNT
      ? images
      : [
          ...images,
          ...seedDishes.slice(0, Math.max(0, MIN_COUNT - images.length)),
        ];

  return (
    <section>
      <h2>Our Dishes</h2>
      <div className="grid">
        {displayImages.map((d, i) => {
          const key = d.id ? d.id : `seed-${i}`;
          return <DishCard key={key} dish={d} />;
        })}
      </div>

      {videos.length > 0 && (
        <>
          <h2 style={{ marginTop: "1.5rem" }}>Featured Videos</h2>
          <div className="grid">
            {videos.map((d) => (
              <VideoCard key={d.id} dish={d} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
