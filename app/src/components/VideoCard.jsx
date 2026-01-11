export default function VideoCard({ dish }) {
  // dish.youtubeId or full URL; extract ID if a full URL is provided
  let id = dish.youtubeId;
  if (!id && dish.youtubeUrl) {
    const m = dish.youtubeUrl.match(/[?&]v=([^&]+)/) || dish.youtubeUrl.match(/youtu\.be\/([^?]+)/);
    id = m ? m[1] : dish.youtubeUrl;
  }
  const src = `https://www.youtube.com/embed/${id}`;
  return (
    <article className="card">
      <div style={{position:'relative',paddingBottom:'56.25%',height:0}}>
        <iframe
          src={src}
          title={dish.name}
          style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="card-body">
        <h3>{dish.name}</h3>
        {dish.description && <p className="muted">{dish.description}</p>}
      </div>
    </article>
  );
}
