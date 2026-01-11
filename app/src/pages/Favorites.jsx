import DishCard from "../components/DishCard.jsx";

const seedFavorites = [
  {
    name: "Margherita Pizza",
    description: "Classic with fresh basil",
    price: 12.0,
    image:
      "https://images.unsplash.com/photo-1548365328-9f3f0c35a1b3?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
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
    name: "Steak Au Poivre",
    description: "Peppercorn sauce",
    price: 24.0,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Mushroom Risotto",
    description: "Creamy arborio rice",
    price: 14.0,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
  {
    name: "Chocolate Lava Cake",
    description: "Molten center",
    price: 8.0,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&q=80&w=1080&auto=format&fit=crop",
  },
];

export default function Favorites() {
  const raw = localStorage.getItem("chefsite_dishes_v1");
  const dishes = raw ? JSON.parse(raw) : [];
  const featured = dishes.filter((d) => d.type === "image" && d.featured);
  const display =
    featured.length > 0 ? featured : seedFavorites.map((s, i) => ({ ...s, id: `seed-${i}` }));

  return (
    <section>
      <h2>Favorite Dishes</h2>
      <div className="grid">
        {display.map((d, i) => (
          <DishCard key={d.id ? d.id : `seed-${i}`} dish={d} />
        ))}
      </div>
    </section>
  );
}
