import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chefsite_reviews_v1';

function StarRating({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star active' : 'star'}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} star${n>1?'s':''}`}
        >★</button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setReviews(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  function addReview(e) {
    e.preventDefault();
    const entry = { id: crypto.randomUUID(), name: name.trim() || 'Anonymous', rating, comment: comment.trim(), date: new Date().toISOString() };
    setReviews([entry, ...reviews]);
    setName('');
    setRating(5);
    setComment('');
  }

  function removeReview(id) {
    setReviews(reviews.filter(r => r.id !== id));
  }

  return (
    <section>
      <h2>Reviews</h2>
      <form className="review-form" onSubmit={addReview}>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Rating
          <StarRating value={rating} onChange={setRating} />
        </label>
        <label>
          Comment
          <textarea rows="3" value={comment} onChange={e => setComment(e.target.value)} required />
        </label>
        <button className="btn" type="submit">Submit Review</button>
      </form>

      <div className="reviews">
        {reviews.length === 0 ? (
          <p className="muted">No reviews yet — be the first!</p>
        ) : (
          reviews.map(r => (
            <article key={r.id} className="review">
              <div className="review-header">
                <strong>{r.name}</strong>
                <span className="rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p>{r.comment}</p>
              <div className="review-meta">
                <time>{new Date(r.date).toLocaleString()}</time>
                <button className="link" onClick={() => removeReview(r.id)}>Delete</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
