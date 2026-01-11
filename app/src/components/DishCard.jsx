export default function DishCard({ dish }) {
  const src = dish.imageDataUrl || dish.image || "/placeholder.svg";
  return (
    <article className="card">
      <img
        src={src}
        alt={dish.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/placeholder.svg";
        }}
      />
      <div className="card-body">
        <h3>{dish.name}</h3>
        {dish.description && <p className="muted">{dish.description}</p>}
        {typeof dish.price === "number" && (
          <div className="price">${dish.price.toFixed(2)}</div>
        )}
      </div>
    </article>
  );
}
